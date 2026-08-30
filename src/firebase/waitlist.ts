import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

export async function joinWaitlist(email: string): Promise<void> {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  const waitlistRef = collection(db, 'waitlist');
  await addDoc(waitlistRef, {
    email,
    joinedAt: serverTimestamp(),
  });
}
