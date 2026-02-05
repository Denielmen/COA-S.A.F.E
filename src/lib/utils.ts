import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type AppLanguage = "en" | "tl" | "bis";

export function getCurrentLanguage(): AppLanguage {
  try {
    const saved = localStorage.getItem("settings");
    if (!saved) return "en";
    const parsed = JSON.parse(saved);
    if (parsed && typeof parsed.language === "string") {
      if (parsed.language === "tl" || parsed.language === "bis") {
        return parsed.language;
      }
    }
    return "en";
  } catch {
    return "en";
  }
}

export function translate(
  language: AppLanguage,
  texts: { en: string; tl?: string; bis?: string },
): string {
  if (language === "tl" && texts.tl) return texts.tl;
  if (language === "bis" && texts.bis) return texts.bis;
  return texts.en;
}
