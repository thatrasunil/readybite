'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
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
  // Customer: mock OTP flow (no billing required)
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (code: string) => Promise<boolean>;
  // Admin: real Firebase Email+Password
  adminLogin: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Pending phone stored between sendOtp and verifyOtp
let _pendingPhone: string | null = null;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to Firebase Auth state (handles admin sessions automatically)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser?.email) {
        // Admin user logged in via Firebase Email/Password
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: 'ADMIN',
          name: firebaseUser.email.split('@')[0],
        });
      } else if (!firebaseUser) {
        // Check localStorage for mock customer session
        const saved = localStorage.getItem('readybite_mock_user');
        if (saved) {
          setUser(JSON.parse(saved));
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  /**
   * CUSTOMER: Mock OTP — simulates sending an OTP.
   * No Firebase phone auth or billing required.
   * OTP is always: 123456
   */
  const sendOtp = async (phone: string): Promise<void> => {
    _pendingPhone = phone;
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    console.log(`[MockOTP] OTP sent to +91${phone} → use 123456`);
  };

  /**
   * CUSTOMER: Verifies the mock OTP code.
   * Accepts only "123456". Creates a local user session.
   */
  const verifyOtp = async (code: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 600));
    if (code !== '123456' || !_pendingPhone) return false;

    const mockUser: User = {
      uid: `user_${_pendingPhone}`,
      phone: `+91${_pendingPhone}`,
      role: 'USER',
      name: _pendingPhone.slice(-4),
    };
    setUser(mockUser);
    localStorage.setItem('readybite_mock_user', JSON.stringify(mockUser));
    _pendingPhone = null;
    return true;
  };

  /**
   * ADMIN: Real Firebase Email+Password authentication.
   * Requires Email/Password Auth enabled in Firebase Console.
   */
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
    // Sign out from Firebase (admin) and clear mock session (customer)
    await signOut(auth);
    localStorage.removeItem('readybite_mock_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, sendOtp, verifyOtp, adminLogin, logout }}>
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
