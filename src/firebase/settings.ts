import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import type { UserSettings } from '../types';

const LOCAL_STORAGE_SETTINGS_PREFIX = 'payifi_settings_';

const DEFAULT_SETTINGS: Omit<UserSettings, 'userId'> = {
  defaultRemindDaysBefore: 3,
  defaultCurrency: 'INR',
  theme: 'dark',
};

export async function getUserSettings(userId: string): Promise<UserSettings> {
  if (!userId) {
    return { userId: '', ...DEFAULT_SETTINGS };
  }

  // Live Firestore
  if (isFirebaseConfigured() && db && !userId.startsWith('demo_user_')) {
    try {
      const docRef = doc(db, 'userSettings', userId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        return {
          userId,
          defaultRemindDaysBefore: data.defaultRemindDaysBefore ?? 3,
          defaultCurrency: data.defaultCurrency || 'INR',
          monthlyBudget: data.monthlyBudget ? Number(data.monthlyBudget) : undefined,
          theme: data.theme || 'dark',
          updatedAt: data.updatedAt?.toDate?.()?.toISOString?.(),
        };
      }
    } catch (e) {
      console.warn('Error fetching Firestore settings, using local:', e);
    }
  }

  // Local fallback
  try {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_SETTINGS_PREFIX}${userId}`);
    if (saved) {
      return { userId, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error reading local settings:', e);
  }

  return { userId, ...DEFAULT_SETTINGS };
}

export async function saveUserSettings(
  userId: string,
  settings: Partial<Omit<UserSettings, 'userId'>>
): Promise<void> {
  if (!userId) return;

  const current = await getUserSettings(userId);
  const updated: UserSettings = {
    ...current,
    ...settings,
    updatedAt: new Date().toISOString(),
  };

  // Save local
  try {
    localStorage.setItem(
      `${LOCAL_STORAGE_SETTINGS_PREFIX}${userId}`,
      JSON.stringify({
        defaultRemindDaysBefore: updated.defaultRemindDaysBefore,
        defaultCurrency: updated.defaultCurrency,
        monthlyBudget: updated.monthlyBudget,
        theme: updated.theme,
      })
    );
  } catch (e) {
    console.error('Error saving local settings:', e);
  }

  // Save Firestore
  if (isFirebaseConfigured() && db && !userId.startsWith('demo_user_')) {
    try {
      const docRef = doc(db, 'userSettings', userId);
      await setDoc(
        docRef,
        {
          defaultRemindDaysBefore: updated.defaultRemindDaysBefore,
          defaultCurrency: updated.defaultCurrency,
          monthlyBudget: updated.monthlyBudget ?? null,
          theme: updated.theme,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      console.error('Error saving Firestore settings:', e);
    }
  }
}
