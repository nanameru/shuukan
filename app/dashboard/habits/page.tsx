"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { CATEGORIES, FREQUENCIES, TIME_OF_DAY } from "@/lib/utils";

const EMOJI_OPTIONS = [
  "🏃",
  "💧",
  "📚",
  "🧘",
  "🍎",
  "💪",
  "✍️",
  "🎯",
  "🧹",
  "🎵",
  "💤",
  "🌅",
];

interface HabitFormData {
  name: string;
  emoji: string;
  category: string;
  frequency: string;
  timeOfDay: string;
}

const defaultForm: HabitFormData = {
  name: "",
  emoji: "🎯",
  category: "health",
  frequency: "daily",
  timeOfDay: "morning",
};

export default function HabitsPage() {
  const { user } = useUser();
  const clerkId = user?.id ?? "";
  const habits = useQuery(api.habits.getHabits, clerkId ? { clerkId } : "skip");
  const createHabit = useMutation(api.habits.createHabit);
  const updateHabit = useMutation(api.habits.updateHabit);
  const deleteHabit = useMutation(api.habits.deleteHabit);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<Id<"habits"> | null>(null);
  const [form, setForm] = useState<HabitFormData>(defaultForm);
  const [deleteConfirm, setDeleteConfirm] = useState<Id<"habits"> | null>(null);

  const openCreate = () => {
    setForm(defaultForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (habit: {
    _id: Id<"habits">;
    name: string;
    emoji: string;
    category: string;
    frequency: string;
    timeOfDay: string;
  }) => {
    setForm({
      name: habit.name,
      emoji: habit.emoji,
      category: habit.category,
      frequency: habit.frequency,
      timeOfDay: habit.timeOfDay,
    });
    setEditingId(habit._id);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !clerkId) return;
    if (editingId) {
      await updateHabit({ habitId: editingId, ...form });
    } else {
      await createHabit({ clerkId, ...form });
    }
    setShowModal(false);
  };

  const handleDelete = async (id: Id<"habits">) => {
    await deleteHabit({ habitId: id });
    setDeleteConfirm(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">習慣管理</h1>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新しい習慣を追加
        </button>
      </div>

      <div className="space-y-3">
        {(habits ?? []).map((habit) => (
          <div
            key={habit._id}
            className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4"
          >
            <span className="text-2xl">{habit.emoji}</span>
            <div className="flex-1">
              <p className="font-medium text-slate-900">{habit.name}</p>
              <p className="text-xs text-slate-400">
                {CATEGORIES[habit.category]} · {FREQUENCIES[habit.frequency]} ·{" "}
                {TIME_OF_DAY[habit.timeOfDay]}
              </p>
            </div>
            <button
              onClick={() => openEdit(habit)}
              className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeleteConfirm(habit._id)}
              className="p-2 text-slate-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {(habits ?? []).length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p>まだ習慣がありません。新しい習慣を追加しましょう！</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? "習慣を編集" : "新しい習慣を追加"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">
                  習慣名
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="例: 朝のストレッチ"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">
                  アイコン
                </label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map((e) => (
                    <button
                      key={e}
                      onClick={() => setForm({ ...form, emoji: e })}
                      className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-colors ${
                        form.emoji === e
                          ? "bg-blue-100 ring-2 ring-blue-500"
                          : "bg-slate-50 hover:bg-slate-100"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">
                  カテゴリ
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {Object.entries(CATEGORIES).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">
                  頻度
                </label>
                <select
                  value={form.frequency}
                  onChange={(e) =>
                    setForm({ ...form, frequency: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {Object.entries(FREQUENCIES).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">
                  時間帯
                </label>
                <select
                  value={form.timeOfDay}
                  onChange={(e) =>
                    setForm({ ...form, timeOfDay: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {Object.entries(TIME_OF_DAY).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!form.name.trim()}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {editingId ? "更新する" : "追加する"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              習慣を削除しますか？
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              この操作は取り消せません。関連する記録もすべて削除されます。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
