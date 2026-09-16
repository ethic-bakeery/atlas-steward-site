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
});
