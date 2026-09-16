import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

function assertAdmin(adminSecret: string) {
  const expected = process.env.ADMIN_API_SECRET;
  if (!expected || adminSecret !== expected) {
    throw new Error("Unauthorized.");
  }
}

// Public: anyone can send a contact message.
export const submit = mutation({
  args: {
    name: v.string(),
    contactInfo: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("contactMessages", {
      ...args,
      read: false,
      submittedAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, internal.emails.sendContactNotification, {
      name: args.name,
      contactInfo: args.contactInfo,
      message: args.message,
    });

    return { id };
  },
});

// Admin: list all messages, most recent first.
export const list = query({
  args: { adminSecret: v.string() },
  handler: async (ctx, args) => {
    assertAdmin(args.adminSecret);
    return await ctx.db
      .query("contactMessages")
      .withIndex("by_submittedAt")
      .order("desc")
      .collect();
  },
});

// Admin: mark a message as read.
export const markRead = mutation({
  args: { id: v.id("contactMessages"), adminSecret: v.string() },
  handler: async (ctx, args) => {
    assertAdmin(args.adminSecret);
    await ctx.db.patch(args.id, { read: true });
  },
});
