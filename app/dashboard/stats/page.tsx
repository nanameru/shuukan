"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Flame, Target, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "@/convex/_generated/api";

export default function StatsPage() {
  const { user } = useUser();
  const clerkId = user?.id ?? "";
  const stats = useQuery(
    api.habitLogs.getStats,
    clerkId ? { clerkId } : "skip",
  );

  if (!stats) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">統計</h1>
        <div className="text-center py-12 text-slate-500">読み込み中...</div>
      </div>
    );
  }

  const topStreaks = [...stats.habits]
    .sort((a, b) => b.currentStreak - a.currentStreak)
    .slice(0, 5);

  const avgCompletion =
    stats.habits.length > 0
      ? Math.round(
          stats.habits.reduce((s, h) => s + h.completionRate, 0) /
            stats.habits.length,
        )
      : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">統計</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-slate-500">総合達成率</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{avgCompletion}%</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-slate-500">最長ストリーク</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {topStreaks[0]?.currentStreak ?? 0}日
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm text-slate-500">トラッキング中</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {stats.habits.length}個
          </p>
        </div>
      </div>

      {/* Weekly Chart */}
      {stats.weeklyData.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            週間完了率
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip
                  formatter={(
                    value?: number | string | Array<number | string>,
                  ) => {
                    const v = typeof value === "number" ? value : Number(value);
                    return [`${v}%`, "完了率"];
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#2563eb" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Category Chart */}
      {stats.categoryData.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            カテゴリ別達成率
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                  tickFormatter={(v: number) => `${v}%`}
                />
                <Tooltip
                  formatter={(
                    value?: number | string | Array<number | string>,
                  ) => {
                    const v = typeof value === "number" ? value : Number(value);
                    return [`${v}%`, "達成率"];
                  }}
                />
                <Bar dataKey="rate" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Streak Ranking */}
      {topStreaks.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            🔥 ストリークランキング
          </h2>
          <div className="space-y-3">
            {topStreaks.map((habit, i) => (
              <div
                key={habit.habitId}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
              >
                <span className="text-lg font-bold text-slate-400 w-6">
                  {i + 1}
                </span>
                <span className="text-xl">{habit.emoji}</span>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{habit.name}</p>
                  <p className="text-xs text-slate-400">{habit.category}</p>
                </div>
                <div className="flex items-center gap-1 text-orange-500">
                  <Flame className="w-4 h-4" />
                  <span className="font-semibold">{habit.currentStreak}日</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
