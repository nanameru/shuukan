"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { CheckCircle2, Circle, Flame, Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  CATEGORIES,
  cn,
  formatDateJP,
  TIME_OF_DAY,
  toDateString,
} from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useUser();
  const clerkId = user?.id ?? "";

  const habits = useQuery(api.habits.getHabits, clerkId ? { clerkId } : "skip");
  const today = toDateString(new Date());
  const weekAgo = toDateString(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const logs = useQuery(
    api.habitLogs.getLogsByDateRange,
    clerkId ? { clerkId, startDate: weekAgo, endDate: today } : "skip",
  );
  const toggleLog = useMutation(api.habitLogs.toggleLog);

  const [selectedCategory, setSelectedCategory] = useState("all");

  const todayLogs = useMemo(
    () => (logs ?? []).filter((l) => l.date === today),
    [logs, today],
  );

  const filteredHabits = useMemo(
    () =>
      (habits ?? []).filter(
        (h) => selectedCategory === "all" || h.category === selectedCategory,
      ),
    [habits, selectedCategory],
  );

  const completedCount = todayLogs.filter((l) => l.completed).length;
  const totalCount = habits?.length ?? 0;
  const completionRate =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const isCompleted = (habitId: Id<"habits">) =>
    todayLogs.some((l) => l.habitId === habitId && l.completed);

  const getStreak = (habitId: Id<"habits">) => {
    if (!logs) return 0;
    let streak = 0;
    const d = new Date();
    for (let i = 0; i < 30; i++) {
      const dateStr = toDateString(d);
      const hasLog = logs.some(
        (l) => l.habitId === habitId && l.date === dateStr && l.completed,
      );
      if (hasLog) {
        streak++;
      } else if (i > 0) {
        break;
      }
      d.setDate(d.getDate() - 1);
    }
    return streak;
  };

  const handleToggle = async (habitId: Id<"habits">) => {
    if (!clerkId) return;
    await toggleLog({ clerkId, habitId, date: today });
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Date & Progress */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          {formatDateJP(new Date())}
        </h1>
        <p className="text-slate-500 mb-4">今日の進捗</p>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">
              {completedCount} / {totalCount} 完了
            </span>
            <span className="text-sm font-semibold text-blue-600">
              {completionRate}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          {completionRate === 100 && totalCount > 0 && (
            <p className="text-center text-green-600 font-medium mt-3">
              🎉 お疲れ様でした！今日の習慣をすべて達成しました！
            </p>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
            selectedCategory === "all"
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50",
          )}
        >
          すべて
        </button>
        {Object.entries(CATEGORIES).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              selectedCategory === key
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {filteredHabits.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <p className="text-slate-500 mb-4">まだ習慣がありません</p>
            <Link
              href="/dashboard/habits"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              習慣を追加する
            </Link>
          </div>
        ) : (
          filteredHabits.map((habit) => {
            const completed = isCompleted(habit._id);
            const streak = getStreak(habit._id);
            return (
              <button
                key={habit._id}
                onClick={() => handleToggle(habit._id)}
                className={cn(
                  "w-full bg-white rounded-xl border p-4 flex items-center gap-4 transition-all hover:shadow-md",
                  completed
                    ? "border-green-200 bg-green-50"
                    : "border-slate-200",
                )}
              >
                {completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-6 h-6 text-slate-300 flex-shrink-0" />
                )}
                <span className="text-2xl">{habit.emoji}</span>
                <div className="flex-1 text-left">
                  <p
                    className={cn(
                      "font-medium",
                      completed
                        ? "text-green-700 line-through"
                        : "text-slate-900",
                    )}
                  >
                    {habit.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {CATEGORIES[habit.category]} ·{" "}
                    {TIME_OF_DAY[habit.timeOfDay]}
                  </p>
                </div>
                {streak > 0 && (
                  <div className="flex items-center gap-1 text-orange-500">
                    <Flame className="w-4 h-4" />
                    <span className="text-sm font-semibold">{streak}</span>
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
