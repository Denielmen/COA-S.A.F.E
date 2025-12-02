import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import dayjs from "dayjs";

const KEY_SCHEDULED = (dateStr: string) => `notifScheduled:${dateStr}`;
const KEY_UNLOCK_REPEAT = "unlockRepeatingScheduled";
const UNLOCK_REPEAT_ID = 800000; // fixed ID for daily repeating unlock
const DEFAULT_CHANNEL_ID = "safe-default"; // Android notification channel id

function todayStr() {
  return dayjs().format("YYYY-MM-DD");
}

function buildIdForHour(dateStr: string, hour: number) {
  // numeric ID like 20250130_8 -> 202501308
  return Number(dayjs(dateStr).format("YYYYMMDD")) * 100 + hour;
}

function atToday(hour: number) {
  return dayjs().hour(hour).minute(0).second(0).millisecond(0).toDate();
}

export async function scheduleForTodayIfNeeded() {
  if (Capacitor.getPlatform() === "web") return; // only for native

  // Respect user setting
  const settingsRaw = localStorage.getItem("settings");
  if (settingsRaw) {
    try {
      const s = JSON.parse(settingsRaw);
      if (s && s.notifications === false) return;
    } catch {}
  }

  const dateStr = todayStr();
  const already = localStorage.getItem(KEY_SCHEDULED(dateStr));
  if (already === "1") return;

  const perm = await LocalNotifications.requestPermissions();
  if (perm.display !== "granted") return;

  // Ensure Android channel exists with vibration according to settings
  await ensureDefaultChannel();

  const notifications = [] as Parameters<typeof LocalNotifications.schedule>[0]["notifications"];

  // 8:00 unlock (one-shot for today; repeating is handled separately)
  notifications.push({
    id: buildIdForHour(dateStr, 8),
    title: "New Module Unlocked",
    body: "Your daily module is now available (8:00).",
    schedule: { at: atToday(8), allowWhileIdle: true },
    smallIcon: "res://mipmap/ic_launcher",
    sound: "default",
    // channelId supported on Android; use any cast to satisfy TS if needed
    ...(Capacitor.getPlatform() === "android" ? { channelId: DEFAULT_CHANNEL_ID } as any : {})
  });

  // reminders every 2 hours until 18:00 (20:00 handled as evening summary)
  for (const h of [10, 12, 14, 16, 18]) {
    notifications.push({
      id: buildIdForHour(dateStr, h),
      title: "Reminder",
      body: "A new module unlocked at 8am. Please read and mark as completed.",
      schedule: { at: atToday(h), allowWhileIdle: true },
      smallIcon: "res://mipmap/ic_launcher",
      sound: "default",
      ...(Capacitor.getPlatform() === "android" ? { channelId: DEFAULT_CHANNEL_ID } as any : {})
    });
  }

  // 20:00 evening summary (single message)
  notifications.push({
    id: buildIdForHour(dateStr, 20),
    title: "Daily Reminder",
    body: "You still have an unlocked module for today.",
    schedule: { at: atToday(20), allowWhileIdle: true },
    smallIcon: "res://mipmap/ic_launcher",
    sound: "default",
    ...(Capacitor.getPlatform() === "android" ? { channelId: DEFAULT_CHANNEL_ID } as any : {})
  });

  await LocalNotifications.schedule({ notifications });
  localStorage.setItem(KEY_SCHEDULED(dateStr), "1");
}

export async function cancelTodayReminders() {
  if (Capacitor.getPlatform() === "web") return; // only for native
  const dateStr = todayStr();
  const ids = [8, 10, 12, 14, 16, 18, 20].map(h => buildIdForHour(dateStr, h));
  await LocalNotifications.cancel({ notifications: ids.map(id => ({ id })) });
}

export async function ensureDailyUnlockRepeating() {
  if (Capacitor.getPlatform() === "web") return;
  const settingsRaw = localStorage.getItem("settings");
  if (settingsRaw) {
    try {
      const s = JSON.parse(settingsRaw);
      if (s && s.notifications === false) return;
    } catch {}
  }

  const perm = await LocalNotifications.requestPermissions();
  if (perm.display !== "granted") return;

  // Ensure Android channel exists with vibration according to settings
  await ensureDefaultChannel();

  const already = localStorage.getItem(KEY_UNLOCK_REPEAT);
  if (already === "1") return;

  await LocalNotifications.schedule({
    notifications: [
      {
        id: UNLOCK_REPEAT_ID,
        title: "New Module Unlocked",
        body: "Your daily module is now available (8:00).",
        schedule: { repeats: true, every: "day", on: { hour: 8, minute: 0 }, allowWhileIdle: true },
        smallIcon: "res://mipmap/ic_launcher",
        sound: "default",
        ...(Capacitor.getPlatform() === "android" ? { channelId: DEFAULT_CHANNEL_ID } as any : {})
      }
    ]
  });
  localStorage.setItem(KEY_UNLOCK_REPEAT, "1");
}

export async function cancelDailyUnlockRepeating() {
  if (Capacitor.getPlatform() === "web") return;
  await LocalNotifications.cancel({ notifications: [{ id: UNLOCK_REPEAT_ID }] });
  localStorage.removeItem(KEY_UNLOCK_REPEAT);
}

async function ensureDefaultChannel() {
  if (Capacitor.getPlatform() !== "android") return;
  // Read vibrate preference (default true)
  let vibrate = true;
  try {
    const raw = localStorage.getItem("settings");
    if (raw) {
      const s = JSON.parse(raw);
      if (typeof s.vibrate === "boolean") vibrate = s.vibrate;
    }
  } catch {}
  try {
    await (LocalNotifications as any).createChannel({
      id: DEFAULT_CHANNEL_ID,
      name: "Project SAFE",
      description: "Daily reminders",
      importance: 5, // high
      visibility: 1,
      lights: true,
      vibration: vibrate,
      vibrationPattern: vibrate ? [200, 100, 200] : undefined,
      sound: "default",
    });
  } catch {}
}

export async function scheduleTestNotificationInMinutes(minutes: number) {
  if (Capacitor.getPlatform() === "web") return;

  const settingsRaw = localStorage.getItem("settings");
  if (settingsRaw) {
    try {
      const s = JSON.parse(settingsRaw);
      if (s && s.notifications === false) return;
    } catch {}
  }

  const perm = await LocalNotifications.requestPermissions();
  if (perm.display !== "granted") return;

  await ensureDefaultChannel();

  const at = new Date(Date.now() + Math.max(1, minutes) * 60 * 1000);
  const id = Number(String(Date.now()).slice(-7));
  await LocalNotifications.schedule({
    notifications: [
      {
        id,
        title: "Test Reminder",
        body: `This is a test notification (${minutes} minute(s)).`,
        schedule: { at, allowWhileIdle: true },
        smallIcon: "res://mipmap/ic_launcher",
        sound: "default",
        ...(Capacitor.getPlatform() === "android" ? { channelId: DEFAULT_CHANNEL_ID } as any : {})
      }
    ]
  });
}