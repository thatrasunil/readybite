'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/Button';
import styles from './Login.module.css';

export default function AdminLoginPage() {
  const { adminLogin } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await adminLogin(email, password);
    if (success) {
      router.push('/admin');
    } else {
      setError('Invalid email or password. Check your Firebase Authentication settings.');
    }
    setIsLoading(false);
  };

  return (
    <main className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>
          Ready<span className={styles.logoAccent}>Bite</span>
        </div>
        <h1 className={styles.title}>Restaurant Partner Login</h1>

        <form className={styles.form} onSubmit={handleLogin}>
          {error && (
            <div style={{
              color: 'var(--error)',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '13px',
              marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          <div className={styles.formGroup} style={{ marginBottom: '20px' }}>
            <label className={styles.formLabel}>Email Address</label>
            <input
              type="email"
              className={styles.phoneInput}
              placeholder="admin@yourrestaurant.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className={styles.formGroup} style={{ marginBottom: '32px' }}>
            <label className={styles.formLabel}>Password</label>
            <input
              type="password"
              className={styles.phoneInput}
              placeholder="Your secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button fullWidth size="lg" disabled={isLoading || !email || !password}>
            {isLoading ? 'Signing in...' : 'Access Control Center'}
          </Button>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <a href="#" className={styles.footerLink}>Forgot password?</a>
          </p>
        </form>

        <div className={styles.footer}>
          Not a restaurant partner?{' '}
          <a href="/" className={styles.footerLink}>Go to User App</a>
        </div>
      </div>
    </main>
  );
}
