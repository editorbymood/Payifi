import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth, isFirebaseConfigured } from './config';

const EMAIL_FOR_SIGN_IN_KEY = 'payifi_email_for_sign_in';
const DEMO_USER_KEY = 'payifi_demo_user';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isDemo?: boolean;
}

/**
 * Sends a passwordless Magic Link to the specified email.
 */
export async function sendMagicLink(email: string): Promise<{ success: boolean; message: string }> {
  if (!isFirebaseConfigured() || !auth) {
    // If live Firebase is not configured, simulate successful magic link for sandbox testing
    window.localStorage.setItem(EMAIL_FOR_SIGN_IN_KEY, email);
    return {
      success: true,
      message: `[Demo Sandbox] Magic link simulation: In live Firebase, an email with a secure one-click link is sent to ${email}. You can also click "Enter Demo Mode" below to test immediately!`,
    };
  }

  const actionCodeSettings = {
    // URL to redirect back to. Must be authorized in the Firebase console.
    url: window.location.origin,
    handleCodeInApp: true,
  };

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem(EMAIL_FOR_SIGN_IN_KEY, email);
    return {
      success: true,
      message: `We've sent a magic login link to ${email}. Click the link in your email to sign in!`,
    };
  } catch (error: any) {
    console.error('Error sending email magic link:', error);
    throw new Error(error.message || 'Failed to send login email. Please try again.');
  }
}

/**
 * Checks if the current page URL is a Firebase Email Magic Link redirect and completes sign-in.
 */
export async function checkAndCompleteMagicLinkSignIn(): Promise<AppUser | null> {
  if (!isFirebaseConfigured() || !auth) {
    return null;
  }

  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem(EMAIL_FOR_SIGN_IN_KEY);
    if (!email) {
      // User opened the link on a different device
      email = window.prompt('Please provide your email for confirmation:');
    }

    if (email) {
      try {
        const result = await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem(EMAIL_FOR_SIGN_IN_KEY);
        // Clear the query params from url cleanly
        window.history.replaceState({}, document.title, window.location.pathname);
        if (result.user) {
          return {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName || result.user.email?.split('@')[0] || 'User',
            isDemo: false,
          };
        }
      } catch (error: any) {
        console.error('Error completing email link sign in:', error);
        throw error;
      }
    }
  }

  return null;
}

/**
 * Sign in as a Demo / Sandbox user for rapid preview & development.
 */
export function signInAsDemoUser(email: string = 'demo@payifi.app'): AppUser {
  const demoUser: AppUser = {
    uid: 'demo_user_payifi_' + email.replace(/[^a-zA-Z0-9]/g, '_'),
    email: email,
    displayName: email.split('@')[0] || 'Demo User',
    isDemo: true,
  };
  localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
  return demoUser;
}

/**
 * Retrieves the currently saved Demo user if any.
 */
export function getSavedDemoUser(): AppUser | null {
  try {
    const saved = localStorage.getItem(DEMO_USER_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

/**
 * Logs out the current user (Firebase or Demo).
 */
export async function logOut(): Promise<void> {
  localStorage.removeItem(DEMO_USER_KEY);
  if (auth) {
    await signOut(auth);
  }
}

/**
 * Observer for authentication state.
 */
export function subscribeToAuthState(callback: (user: AppUser | null) => void): () => void {
  // First check if Demo user is active
  const demoUser = getSavedDemoUser();
  if (demoUser) {
    callback(demoUser);
  }

  if (auth && isFirebaseConfigured()) {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Live Firebase user takes precedence
        callback({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          isDemo: false,
        });
      } else {
        // Fall back to demo user if present, else null
        const currentDemo = getSavedDemoUser();
        callback(currentDemo);
      }
    });
    return () => {
      unsubscribe();
    };
  }

  // Return no-op if no live auth
  return () => {};
}
