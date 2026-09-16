import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Every admin-only function below requires `adminSecret` and checks it
 * against the ADMIN_API_SECRET environment variable set on this Convex
 * deployment (see README — "npx convex env set ADMIN_API_SECRET ...").
 * This must match the ADMIN_API_SECRET in the Next.js app's environment.
 * The Next.js server is the only thing that ever sends this value — it is
 * never shipped to the browser.
 */
function assertAdmin(adminSecret: string) {
  const expected = process.env.ADMIN_API_SECRET;
  if (!expected || adminSecret !== expected) {
    throw new Error("Unauthorized.");
  }
}

// Step 1 of the photo upload flow: the public registration form calls this
// to get a short-lived URL it can POST the passport photo file to directly.
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Public: called once the applicant has filled the form and uploaded a photo.
export const register = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    dateOfBirth: v.string(),
    address: v.string(),
    area: v.string(),
    serviceCategory: v.string(),
    yearsExperience: v.number(),
    priorWorkDescription: v.string(),
    referenceName: v.string(),
    referencePhone: v.string(),
    photoStorageId: v.id("_storage"),
    agreedToTerms: v.boolean(),
  },
  handler: async (ctx, args) => {
    if (!args.agreedToTerms) {
      throw new Error("You must agree to the Academy terms and conditions.");
    }

    const id = await ctx.db.insert("technicians", {
      ...args,
      status: "pending",
      submittedAt: Date.now(),
    });

    // Fire-and-forget the confirmation email; failures there shouldn't
    // block the applicant from seeing a successful submission.
    await ctx.scheduler.runAfter(0, internal.emails.sendConfirmationEmail, {
      to: args.email,
      fullName: args.fullName,
    });

    return { id };
  },
});

// Admin: list every applicant, most recent first, with a viewable photo URL.
export const list = query({
  args: { adminSecret: v.string() },
  handler: async (ctx, args) => {
    assertAdmin(args.adminSecret);
    const docs = await ctx.db.query("technicians").withIndex("by_submittedAt").order("desc").collect();
    return await Promise.all(
      docs.map(async (doc) => ({
        ...doc,
        photoUrl: await ctx.storage.getUrl(doc.photoStorageId),
      }))
    );
  },
});

// Admin: full detail for a single applicant.
export const getById = query({
  args: { id: v.id("technicians"), adminSecret: v.string() },
  handler: async (ctx, args) => {
    assertAdmin(args.adminSecret);
    const doc = await ctx.db.get(args.id);
    if (!doc) return null;
    return { ...doc, photoUrl: await ctx.storage.getUrl(doc.photoStorageId) };
  },
});

// Admin: approve or reject an applicant.
export const updateStatus = mutation({
  args: {
    id: v.id("technicians"),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    adminSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertAdmin(args.adminSecret);
    await ctx.db.patch(args.id, { status: args.status });
  },
});
