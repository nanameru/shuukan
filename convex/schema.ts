import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    theme: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  habits: defineTable({
    userId: v.id("users"),
    name: v.string(),
    emoji: v.string(),
    category: v.string(),
    frequency: v.string(),
    customDays: v.optional(v.array(v.number())),
    timeOfDay: v.string(),
    isArchived: v.boolean(),
    sortOrder: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  habitLogs: defineTable({
    habitId: v.id("habits"),
    userId: v.id("users"),
    date: v.string(),
    completed: v.boolean(),
    completedAt: v.optional(v.number()),
    note: v.optional(v.string()),
  })
    .index("by_habit_date", ["habitId", "date"])
    .index("by_user_date", ["userId", "date"]),
});
