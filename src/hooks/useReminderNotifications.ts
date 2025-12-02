import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const PROGRESS_STORAGE_KEY = "userProgress";

function isTodayCompleted(): boolean {
  const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
  if (!saved) return false;
  try {
    const parsed = JSON.parse(saved);
    const completedLessons: string[] = parsed?.completedLessons || [];
    const today = dayjs().format("YYYY-MM-DD");
    return completedLessons.includes(today);
  } catch {
    return false;
  }
}

function todayTriggeredKey() {
  return `notifTriggered:${dayjs().format("YYYY-MM-DD")}`;
}

function hasTriggered(type: string) {
  const key = todayTriggeredKey();
  const raw = localStorage.getItem(key);
  const set = raw ? new Set<string>(JSON.parse(raw)) : new Set<string>();
  return set.has(type);
}

function markTriggered(type: string) {
  const key = todayTriggeredKey();
  const raw = localStorage.getItem(key);
  const arr: string[] = raw ? JSON.parse(raw) : [];
  if (!arr.includes(type)) {
    arr.push(type);
    localStorage.setItem(key, JSON.stringify(arr));
  }
}

async function notify(title: string, body: string) {
  try {
    if ("Notification" in window) {
      const permission = Notification.permission;
      if (permission === "default") {
        await Notification.requestPermission();
      }
      if (Notification.permission === "granted") {
        new Notification(title, { body });
        try {
          const raw = localStorage.getItem("settings");
          const s = raw ? JSON.parse(raw) : {};
          const vibrate = s?.vibrate !== false; // default true
          if (vibrate && "vibrate" in navigator) {
            navigator.vibrate?.([150, 75, 150]);
          }
        } catch {}
        return;
      }
    }
  } catch {}
  await Swal.fire({ title, text: body, icon: "info", timer: 5000, showConfirmButton: false });
  try {
    const raw = localStorage.getItem("settings");
    const s = raw ? JSON.parse(raw) : {};
    const vibrate = s?.vibrate !== false; // default true
    if (vibrate && "vibrate" in navigator) {
      navigator.vibrate?.(200);
    }
  } catch {}
}

export function useReminderNotifications() {
  useEffect(() => {
    const notificationsEnabled = (() => {
      const raw = localStorage.getItem("settings");
      if (!raw) return true;
      try {
        const s = JSON.parse(raw);
        return s?.notifications !== false;
      } catch {
        return true;
      }
    })();


    if (!notificationsEnabled) return;

    // On native platforms, schedule OS-level notifications for today and exit.
    if (Capacitor.getPlatform() !== "web") {
      import("@/notifications/mobileScheduler").then((m) => {
        m.ensureDailyUnlockRepeating();
        m.scheduleForTodayIfNeeded();
      });
      return;
    }

    const tick = async () => {
      const now = dayjs();
      const minute = now.minute();
      const hour = now.hour();

      const completed = isTodayCompleted();

      // 8:00 unlock notification
      if (!hasTriggered("unlock") && hour === 8 && minute === 0) {
        await notify("New Module Unlocked", "Your daily module is now available (8:00).");
        markTriggered("unlock");
      }

      // Reminders at 10, 12, 14, 16, 18 if not completed
      const reminderHours = [10, 12, 14, 16, 18];
      if (!completed && reminderHours.includes(hour) && minute === 0 && !hasTriggered(`reminder-${hour}`)) {
        await notify("Reminder", "A new module unlocked at 8am. Please read and mark as completed.");
        markTriggered(`reminder-${hour}`);
      }


      // 20:00 evening summary if still not completed
      if (!completed && hour === 20 && minute === 0 && !hasTriggered("evening")) {
        await notify("Daily Reminder", "You still have an unlocked module for today.");
        markTriggered("evening");
      }
    };

    // Immediate catch-up: if it's already past 20:00 and no evening notification yet
    const now = dayjs();
    if (!isTodayCompleted() && now.hour() >= 20 && !hasTriggered("evening")) {
      notify("Daily Reminder", "You still have an unlocked module for today.").then(() => {
        markTriggered("evening");
      });
    }

    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, []);
}