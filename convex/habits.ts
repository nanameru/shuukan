import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getHabits = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    if (!user) return [];
    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    return habits
      .filter((h) => !h.isArchived)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const createHabit = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    emoji: v.string(),
    category: v.string(),
    frequency: v.string(),
    customDays: v.optional(v.array(v.number())),
    timeOfDay: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    if (!user) throw new Error("ユーザーが見つかりません");

    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return await ctx.db.insert("habits", {
      userId: user._id,
      name: args.name,
      emoji: args.emoji,
      category: args.category,
      frequency: args.frequency,
      customDays: args.customDays,
      timeOfDay: args.timeOfDay,
      isArchived: false,
      sortOrder: habits.length,
      createdAt: Date.now(),
    });
  },
});

export const updateHabit = mutation({
  args: {
    habitId: v.id("habits"),
    name: v.string(),
    emoji: v.string(),
    category: v.string(),
    frequency: v.string(),
    customDays: v.optional(v.array(v.number())),
    timeOfDay: v.string(),
  },
  handler: async (ctx, args) => {
    const { habitId, ...rest } = args;
    await ctx.db.patch(habitId, rest);
  },
});

export const deleteHabit = mutation({
  args: { habitId: v.id("habits") },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("habitLogs")
      .withIndex("by_habit_date", (q) => q.eq("habitId", args.habitId))
      .collect();
    for (const log of logs) {
      await ctx.db.delete(log._id);
    }
    await ctx.db.delete(args.habitId);
  },
});

export const createManyHabits = mutation({
  args: {
    clerkId: v.string(),
    habits: v.array(
      v.object({
        name: v.string(),
        emoji: v.string(),
        category: v.string(),
        frequency: v.string(),
        timeOfDay: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    if (!user) throw new Error("ユーザーが見つかりません");

    const existing = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    let sortOrder = existing.length;
    for (const habit of args.habits) {
      await ctx.db.insert("habits", {
        userId: user._id,
        name: habit.name,
        emoji: habit.emoji,
        category: habit.category,
        frequency: habit.frequency,
        timeOfDay: habit.timeOfDay,
        isArchived: false,
        sortOrder,
        createdAt: Date.now(),
      });
      sortOrder++;
    }
  },
});
