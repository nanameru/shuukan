import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDateJP(date: Date): string {
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const day = dayNames[date.getDay()];
  return `${y}年${m}月${d}日(${day})`;
}

export function toDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

export const CATEGORIES: Record<string, string> = {
  health: "健康",
  work: "仕事",
  study: "勉強",
  hobby: "趣味",
  housework: "家事",
  other: "その他",
};

export const TIME_OF_DAY: Record<string, string> = {
  morning: "朝",
  afternoon: "昼",
  evening: "夜",
};

export const FREQUENCIES: Record<string, string> = {
  daily: "毎日",
  weekdays: "平日",
  custom: "カスタム",
};
