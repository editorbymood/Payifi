import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import type { Subscription, SubscriptionFormData } from '../types';
import { calculateNextRenewalDate } from '../utils/calculations';
import { SAMPLE_SEED_DATA } from '../data/presets';

const LOCAL_STORAGE_KEY_PREFIX = 'payifi_subscriptions_';

function getLocalSubscriptions(userId: string): Subscription[] {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error loading local subscriptions', e);
  }
  return [];
}

function saveLocalSubscriptions(userId: string, subs: Subscription[]): void {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(subs));
    // Trigger custom window event for reactive UI updates across components
    window.dispatchEvent(new CustomEvent(`payifi_local_update_${userId}`, { detail: subs }));
  } catch (e) {
    console.error('Error saving local subscriptions', e);
  }
}

/**
 * Subscribes to real-time subscription updates for a specific user.
 * Sorted by soonest renewal date first.
 */
export function subscribeToSubscriptions(
  userId: string,
  onUpdate: (subs: Subscription[]) => void
): () => void {
  if (!userId) {
    onUpdate([]);
    return () => {};
  }

  // If live Firebase Firestore is active and configured
  if (isFirebaseConfigured() && db && !userId.startsWith('demo_user_')) {
    const subsRef = collection(db, 'subscriptions');
    const q = query(subsRef, where('userId', '==', userId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const subs: Subscription[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          subs.push({
            id: docSnap.id,
            userId: data.userId,
            name: data.name || '',
            category: data.category || 'Other',
            cost: Number(data.cost) || 0,
            currency: data.currency || 'INR',
            billingCycle: data.billingCycle || 'monthly',
            customCycleDays: data.customCycleDays,
            renewalDate: data.renewalDate || new Date().toISOString().split('T')[0],
            remindDaysBefore: Number(data.remindDaysBefore) ?? 3,
            notes: data.notes || '',
            isActive: data.isActive !== undefined ? data.isActive : true,
            color: data.color || '#6366f1',
            createdAt: data.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
          });
        });

        // Sort by soonest renewal date first
        subs.sort((a, b) => a.renewalDate.localeCompare(b.renewalDate));
        onUpdate(subs);
      },
      (err) => {
        console.error('Firestore subscription error:', err);
        // Fallback to local storage
        const local = getLocalSubscriptions(userId);
        local.sort((a, b) => a.renewalDate.localeCompare(b.renewalDate));
        onUpdate(local);
      }
    );

    return () => unsubscribe();
  }

  // Fallback: LocalStorage / Demo reactive store
  let localSubs = getLocalSubscriptions(userId);

  // If empty and it's a fresh demo user, auto-seed realistic sample data
  if (localSubs.length === 0 && userId.startsWith('demo_user_')) {
    localSubs = SAMPLE_SEED_DATA.map((seed, index) => ({
      ...seed,
      id: 'sub_demo_' + (index + 1) + '_' + Date.now(),
      userId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    saveLocalSubscriptions(userId, localSubs);
  }

  localSubs.sort((a, b) => a.renewalDate.localeCompare(b.renewalDate));
  onUpdate(localSubs);

  const handleLocalUpdate = (event: Event) => {
    const customEvent = event as CustomEvent<Subscription[]>;
    const updated = [...(customEvent.detail || getLocalSubscriptions(userId))];
    updated.sort((a, b) => a.renewalDate.localeCompare(b.renewalDate));
    onUpdate(updated);
  };

  window.addEventListener(`payifi_local_update_${userId}`, handleLocalUpdate);
  return () => {
    window.removeEventListener(`payifi_local_update_${userId}`, handleLocalUpdate);
  };
}

/**
 * Creates a new subscription document scoped to the user's uid.
 */
export async function createSubscription(
  userId: string,
  formData: SubscriptionFormData
): Promise<string> {
  if (isFirebaseConfigured() && db && !userId.startsWith('demo_user_')) {
    const subsRef = collection(db, 'subscriptions');
    const docRef = await addDoc(subsRef, {
      ...formData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  // Local storage mode
  const local = getLocalSubscriptions(userId);
  const newId = 'sub_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
  const newSub: Subscription = {
    ...formData,
    id: newId,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  local.push(newSub);
  saveLocalSubscriptions(userId, local);
  return newId;
}

/**
 * Updates an existing subscription.
 */
export async function updateSubscription(
  userId: string,
  subscriptionId: string,
  formData: Partial<SubscriptionFormData>
): Promise<void> {
  if (isFirebaseConfigured() && db && !userId.startsWith('demo_user_')) {
    const docRef = doc(db, 'subscriptions', subscriptionId);
    await updateDoc(docRef, {
      ...formData,
      updatedAt: serverTimestamp(),
    });
    return;
  }

  // Local storage mode
  const local = getLocalSubscriptions(userId);
  const index = local.findIndex((s) => s.id === subscriptionId);
  if (index !== -1) {
    local[index] = {
      ...local[index],
      ...formData,
      updatedAt: new Date().toISOString(),
    };
    saveLocalSubscriptions(userId, local);
  }
}

/**
 * Deletes a subscription document.
 */
export async function deleteSubscription(userId: string, subscriptionId: string): Promise<void> {
  if (isFirebaseConfigured() && db && !userId.startsWith('demo_user_')) {
    const docRef = doc(db, 'subscriptions', subscriptionId);
    await deleteDoc(docRef);
    return;
  }

  // Local storage mode
  let local = getLocalSubscriptions(userId);
  local = local.filter((s) => s.id !== subscriptionId);
  saveLocalSubscriptions(userId, local);
}

/**
 * Toggles subscription active/paused status.
 */
export async function toggleSubscriptionStatus(
  userId: string,
  subscriptionId: string,
  currentStatus: boolean
): Promise<void> {
  await updateSubscription(userId, subscriptionId, {
    isActive: !currentStatus,
  });
}

/**
 * Advances a subscription renewal date to the next cycle (when user marks it paid / renewed).
 */
export async function advanceSubscriptionRenewal(
  userId: string,
  subscription: Subscription
): Promise<string> {
  const nextDate = calculateNextRenewalDate(
    subscription.renewalDate,
    subscription.billingCycle,
    subscription.customCycleDays
  );

  await updateSubscription(userId, subscription.id, {
    renewalDate: nextDate,
  });

  return nextDate;
}

/**
 * Seeds sample realistic subscriptions into the user's account.
 */
export async function seedSampleSubscriptions(userId: string): Promise<void> {
  for (const sample of SAMPLE_SEED_DATA) {
    await createSubscription(userId, sample);
  }
}

/**
 * Imports multiple subscriptions at once.
 */
export async function importSubscriptions(
  userId: string,
  subscriptionsToImport: SubscriptionFormData[]
): Promise<number> {
  let count = 0;
  for (const sub of subscriptionsToImport) {
    await createSubscription(userId, sub);
    count++;
  }
  return count;
}
