import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

function assertAdmin(adminSecret: string) {
  const expected = process.env.ADMIN_API_SECRET;

  if (!expected || adminSecret !== expected) {
    throw new Error("Unauthorized.");
  }
}

// Public: the first-touch Academy application.
// Validated server-side too — never trust that the browser's own
// form validation was actually enforced.
export const submit = mutation({
  args: {
    fullName: v.string(),
    age: v.number(),
    phone: v.string(),
    location: v.string(),
    emergencyContact: v.string(),
    educationLevel: v.union(
      v.literal("none"),
      v.literal("primary"),
      v.literal("secondary"),
      v.literal("diploma_ond"),
      v.literal("degree_hnd"),
      v.literal("other")
    ),
    tradePreference: v.union(
      v.literal("electrical"),
      v.literal("plumbing"),
      v.literal("cleaning")
    ),
    motivation: v.string(),
    canAttendConsistently: v.boolean(),
    hasConflictingCommitment: v.boolean(),
    conflictingCommitmentExplanation: v.optional(v.string()),
    experienceLevel: v.union(
      v.literal("none"),
      v.literal("beginner"),
      v.literal("some"),
      v.literal("experienced")
    ),
    experienceExplanation: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const fullName = args.fullName.trim();
    const phone = args.phone.trim();
    const location = args.location.trim();
    const emergencyContact = args.emergencyContact.trim();
    const motivation = args.motivation.trim();

    if (
      !fullName ||
      !phone ||
      !location ||
      !emergencyContact ||
      !motivation
    ) {
      throw new Error("Please fill in all required fields.");
    }

    if (
      !Number.isInteger(args.age) ||
      args.age < 16 ||
      args.age > 100
    ) {
      throw new Error("Age must be a number between 16 and 100.");
    }

    if (
      args.hasConflictingCommitment &&
      !args.conflictingCommitmentExplanation?.trim()
    ) {
      throw new Error(
        "Please briefly explain the conflicting commitment you mentioned."
      );
    }

    if (
      args.experienceLevel !== "none" &&
      !args.experienceExplanation?.trim()
    ) {
      throw new Error("Please briefly describe your experience.");
    }

    const id = await ctx.db.insert("academyApplications", {
      fullName,
      age: args.age,
      phone,
      location,
      emergencyContact,
      educationLevel: args.educationLevel,
      tradePreference: args.tradePreference,
      motivation,
      canAttendConsistently: args.canAttendConsistently,
      hasConflictingCommitment: args.hasConflictingCommitment,
      conflictingCommitmentExplanation:
        args.conflictingCommitmentExplanation?.trim(),
      experienceLevel: args.experienceLevel,
      experienceExplanation: args.experienceExplanation?.trim(),
      status: "pending",
      submittedAt: Date.now(),
    });

    // No email was collected on this form, so we can only notify
    // the admin inbox.
    await ctx.scheduler.runAfter(
      0,
      internal.emails.sendAcademyApplicationNotification,
      {
        fullName,
        phone,
        tradePreference: args.tradePreference,
      }
    );

    return { id };
  },
});

// Admin: list every application, most recent first.
export const list = query({
  args: {
    adminSecret: v.string(),
  },

  handler: async (ctx, args) => {
    assertAdmin(args.adminSecret);

    return await ctx.db
      .query("academyApplications")
      .withIndex("by_submittedAt")
      .order("desc")
      .collect();
  },
});

// Admin: full detail for a single application.
export const getById = query({
  args: {
    id: v.id("academyApplications"),
    adminSecret: v.string(),
  },

  handler: async (ctx, args) => {
    assertAdmin(args.adminSecret);

    return await ctx.db.get(args.id);
  },
});

// Admin: approve or reject an application.
export const updateStatus = mutation({
  args: {
    id: v.id("academyApplications"),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    adminSecret: v.string(),
  },

  handler: async (ctx, args) => {
    assertAdmin(args.adminSecret);

    await ctx.db.patch(args.id, {
      status: args.status,
    });
  },
});
