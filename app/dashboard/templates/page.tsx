"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";

interface TemplateHabit {
  name: string;
  emoji: string;
  category: string;
  frequency: string;
  timeOfDay: string;
}

interface Template {
  id: string;
  name: string;
  emoji: string;
  description: string;
  habits: TemplateHabit[];
}

const TEMPLATES: Template[] = [
  {
    id: "morning",
    name: "朝のルーティン",
    emoji: "🌅",
    description: "充実した朝で1日をスタート",
    habits: [
      {
        name: "早起き",
        emoji: "⏰",
        category: "health",
        frequency: "daily",
        timeOfDay: "morning",
      },
      {
        name: "水を飲む",
        emoji: "💧",
        category: "health",
        frequency: "daily",
        timeOfDay: "morning",
      },
      {
        name: "ストレッチ",
        emoji: "🤸",
        category: "health",
        frequency: "daily",
        timeOfDay: "morning",
      },
      {
        name: "瞑想",
        emoji: "🧘",
        category: "health",
        frequency: "daily",
        timeOfDay: "morning",
      },
      {
        name: "朝食を食べる",
        emoji: "🍳",
        category: "health",
        frequency: "daily",
        timeOfDay: "morning",
      },
    ],
  },
  {
    id: "health",
    name: "健康的な生活",
    emoji: "💪",
    description: "心と体を健やかに保つ習慣",
    habits: [
      {
        name: "運動30分",
        emoji: "🏃",
        category: "health",
        frequency: "daily",
        timeOfDay: "afternoon",
      },
      {
        name: "8時間睡眠",
        emoji: "💤",
        category: "health",
        frequency: "daily",
        timeOfDay: "evening",
      },
      {
        name: "野菜を食べる",
        emoji: "🥗",
        category: "health",
        frequency: "daily",
        timeOfDay: "afternoon",
      },
      {
        name: "1万歩歩く",
        emoji: "🚶",
        category: "health",
        frequency: "daily",
        timeOfDay: "afternoon",
      },
    ],
  },
  {
    id: "study",
    name: "勉強習慣",
    emoji: "📚",
    description: "知識とスキルを着実に積み上げる",
    habits: [
      {
        name: "読書30分",
        emoji: "📖",
        category: "study",
        frequency: "daily",
        timeOfDay: "evening",
      },
      {
        name: "英語学習",
        emoji: "🇬🇧",
        category: "study",
        frequency: "daily",
        timeOfDay: "morning",
      },
      {
        name: "資格勉強",
        emoji: "✍️",
        category: "study",
        frequency: "weekdays",
        timeOfDay: "evening",
      },
      {
        name: "復習",
        emoji: "🔄",
        category: "study",
        frequency: "daily",
        timeOfDay: "evening",
      },
    ],
  },
  {
    id: "tidy",
    name: "整理整頓",
    emoji: "🧹",
    description: "きれいな環境で生産性アップ",
    habits: [
      {
        name: "掃除",
        emoji: "🧹",
        category: "housework",
        frequency: "daily",
        timeOfDay: "morning",
      },
      {
        name: "片付け",
        emoji: "📦",
        category: "housework",
        frequency: "daily",
        timeOfDay: "evening",
      },
      {
        name: "洗濯",
        emoji: "👕",
        category: "housework",
        frequency: "daily",
        timeOfDay: "morning",
      },
      {
        name: "買い物リスト作成",
        emoji: "📝",
        category: "housework",
        frequency: "weekdays",
        timeOfDay: "morning",
      },
    ],
  },
];

export default function TemplatesPage() {
  const { user } = useUser();
  const clerkId = user?.id ?? "";
  const createMany = useMutation(api.habits.createManyHabits);
  const [addedTemplates, setAddedTemplates] = useState<Set<string>>(new Set());

  const handleAddTemplate = async (template: Template) => {
    if (!clerkId) return;
    await createMany({ clerkId, habits: template.habits });
    setAddedTemplates((prev) => new Set(prev).add(template.id));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">テンプレート</h1>
      <p className="text-slate-500 mb-6">
        おすすめの習慣セットをワンクリックで追加できます。
      </p>

      <div className="grid gap-6">
        {TEMPLATES.map((template) => {
          const isAdded = addedTemplates.has(template.id);
          return (
            <div
              key={template.id}
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {template.emoji} {template.name}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {template.description}
                  </p>
                </div>
                <button
                  onClick={() => handleAddTemplate(template)}
                  disabled={isAdded}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isAdded
                      ? "bg-green-50 text-green-600 cursor-default"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      追加済み
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      追加する
                    </>
                  )}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {template.habits.map((habit) => (
                  <span
                    key={habit.name}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-slate-50 rounded-full text-sm text-slate-600"
                  >
                    {habit.emoji} {habit.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
