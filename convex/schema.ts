import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  technicians: defineTable({
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    dateOfBirth: v.string(), // stored as "YYYY-MM-DD" from a date input
    address: v.string(),
    area: v.string(), // neighbourhood / quarters
    serviceCategory: v.string(), // one of siteConfig.services keys
    yearsExperience: v.number(),
    priorWorkDescription: v.string(),
    referenceName: v.string(),
    referencePhone: v.string(),
    photoStorageId: v.id("_storage"),
    agreedToTerms: v.boolean(),

    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),

    submittedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_submittedAt", ["submittedAt"]),

  contactMessages: defineTable({
    name: v.string(),
    contactInfo: v.string(), // phone or email, whichever the sender gave
    message: v.string(),
    read: v.boolean(),
    submittedAt: v.number(),
  }).index("by_submittedAt", ["submittedAt"]),

  academyApplications: defineTable({
    fullName: v.string(),
    age: v.number(),
    phone: v.string(),
    location: v.string(), // area/neighbourhood within Yola
    emergencyContact: v.string(), // name + phone, entered as one field

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

    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),

    submittedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_submittedAt", ["submittedAt"]),
});
