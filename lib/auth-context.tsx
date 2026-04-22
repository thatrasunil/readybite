'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  ConfirmationResult,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './firebase';

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  uid: string;
  phone?: string | null;
  email?: string | null;
  role: UserRole;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (code: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Listen for Firebase Auth state — persists sessions on reload
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const role: UserRole = firebaseUser.email ? 'ADMIN' : 'USER';
        setUser({
          uid: firebaseUser.uid,
          phone: firebaseUser.phoneNumber,
          email: firebaseUser.email,
          role,
          name: firebaseUser.phoneNumber
            ? firebaseUser.phoneNumber.slice(-4)
            : firebaseUser.email?.split('@')[0] ?? 'Admin',
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  /**
   * Creates or resets the invisible reCAPTCHA verifier.
   * Must be called AFTER the #recaptcha-container div is in the DOM.
   * Resets on each call to avoid "reCAPTCHA has already been rendered" errors.
   */
  const setupRecaptcha = () => {
    // Clear any stale verifier
    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.clear();
      recaptchaVerifierRef.current = null;
    }

    recaptchaVerifierRef.current = new RecaptchaVerifier(
      auth,
      'recaptcha-container',
      {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved — SMS will be sent
          console.log('[reCAPTCHA] solved');
        },
        'expired-callback': () => {
          // Reset if it expires
          recaptchaVerifierRef.current?.clear();
          recaptchaVerifierRef.current = null;
        },
      }
    );

    return recaptchaVerifierRef.current;
  };

  /**
   * Sends a real OTP SMS to the given phone number via Firebase Auth.
   * Requires Phone Authentication to be enabled in Firebase Console.
   * For testing: add the number as a test number in Firebase Console.
   */
  const sendOtp = async (phone: string): Promise<void> => {
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    const verifier = setupRecaptcha();
    const result = await signInWithPhoneNumber(auth, formattedPhone, verifier);
    confirmationResultRef.current = result;
  };

  /**
   * Verifies the OTP code entered by the user against the Firebase confirmation.
   */
  const verifyOtp = async (code: string): Promise<boolean> => {
    if (!confirmationResultRef.current) return false;
    try {
      await confirmationResultRef.current.confirm(code);
      return true;
    } catch (err) {
      console.error('[OTP] Verification failed:', err);
      return false;
    }
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err) {
      console.error('[Admin Login] Failed:', err);
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.clear();
      recaptchaVerifierRef.current = null;
    }
    confirmationResultRef.current = null;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, sendOtp, verifyOtp, adminLogin, logout }}>
      {/*
        This div is the anchor for Firebase's invisible reCAPTCHA widget.
        It must be in the DOM before sendOtp() is called.
        Do NOT remove it.
      */}
      <div id="recaptcha-container" style={{ position: 'fixed', bottom: 0, zIndex: -1 }}></div>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
