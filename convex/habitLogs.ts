import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getLogsByDateRange = query({
  args: {
    clerkId: v.string(),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    if (!user) return [];

    const logs = await ctx.db
      .query("habitLogs")
      .withIndex("by_user_date", (q) => q.eq("userId", user._id))
      .collect();

    return logs.filter(
      (log) => log.date >= args.startDate && log.date <= args.endDate,
    );
  },
});

export const toggleLog = mutation({
  args: {
    clerkId: v.string(),
    habitId: v.id("habits"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    if (!user) throw new Error("ユーザーが見つかりません");

    const existing = await ctx.db
      .query("habitLogs")
      .withIndex("by_habit_date", (q) =>
        q.eq("habitId", args.habitId).eq("date", args.date),
      )
      .first();

    if (existing) {
      if (existing.completed) {
        await ctx.db.patch(existing._id, {
          completed: false,
          completedAt: undefined,
        });
      } else {
        await ctx.db.patch(existing._id, {
          completed: true,
          completedAt: Date.now(),
        });
      }
      return;
    }

    await ctx.db.insert("habitLogs", {
      habitId: args.habitId,
      userId: user._id,
      date: args.date,
      completed: true,
      completedAt: Date.now(),
    });
  },
});

export const getStats = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    if (!user) return { habits: [], weeklyData: [], categoryData: [] };

    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const activeHabits = habits.filter((h) => !h.isArchived);

    const logs = await ctx.db
      .query("habitLogs")
      .withIndex("by_user_date", (q) => q.eq("userId", user._id))
      .collect();

    const completedLogs = logs.filter((l) => l.completed);

    // Calculate streaks for each habit
    const habitStats = activeHabits.map((habit) => {
      const habitLogs = completedLogs
        .filter((l) => l.habitId === habit._id)
        .map((l) => l.date)
        .sort()
        .reverse();

      let currentStreak = 0;
      const today = new Date();
      const checkDate = new Date(today);

      for (let i = 0; i < 365; i++) {
        const dateStr = checkDate.toISOString().split("T")[0];
        if (habitLogs.includes(dateStr)) {
          currentStreak++;
        } else if (i > 0) {
          break;
        }
        checkDate.setDate(checkDate.getDate() - 1);
      }

      const totalDays = Math.max(
        1,
        Math.ceil((Date.now() - habit.createdAt) / (1000 * 60 * 60 * 24)),
      );
      const completionRate = Math.round((habitLogs.length / totalDays) * 100);

      return {
        habitId: habit._id,
        name: habit.name,
        emoji: habit.emoji,
        category: habit.category,
        currentStreak,
        completionRate: Math.min(100, completionRate),
      };
    });

    // Weekly data (last 7 days)
    const weeklyData: Array<{ date: string; rate: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayLogs = completedLogs.filter((l) => l.date === dateStr);
      const rate =
        activeHabits.length > 0
          ? Math.round((dayLogs.length / activeHabits.length) * 100)
          : 0;
      const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
      weeklyData.push({
        date: `${d.getMonth() + 1}/${d.getDate()}(${dayNames[d.getDay()]})`,
        rate,
      });
    }

    // Category data
    const categories = [
      "health",
      "work",
      "study",
      "hobby",
      "housework",
      "other",
    ];
    const categoryLabels: Record<string, string> = {
      health: "健康",
      work: "仕事",
      study: "勉強",
      hobby: "趣味",
      housework: "家事",
      other: "その他",
    };
    const categoryData = categories
      .map((cat) => {
        const catHabits = activeHabits.filter((h) => h.category === cat);
        if (catHabits.length === 0) return null;
        const avgRate =
          catHabits.reduce((sum, h) => {
            const stat = habitStats.find((s) => s.habitId === h._id);
            return sum + (stat?.completionRate ?? 0);
          }, 0) / catHabits.length;
        return {
          category: categoryLabels[cat] ?? cat,
          rate: Math.round(avgRate),
        };
      })
      .filter((d): d is { category: string; rate: number } => d !== null);

    return { habits: habitStats, weeklyData, categoryData };
  },
});
