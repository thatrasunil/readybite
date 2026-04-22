'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from './Button';
import styles from './LoginModal.module.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { sendOtp, verifyOtp } = useAuth();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    if (phone.length < 10) return;
    setIsLoading(true);
    setError('');
    try {
      await sendOtp(phone);
      setStep(2);
    } catch (e: unknown) {
      setError('Something went wrong. Please try again.');
      console.error(e);
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length < 6) return;
    setIsLoading(true);
    setError('');
    try {
      const success = await verifyOtp(code);
      if (success) {
        onClose();
        setStep(1);
        setPhone('');
        setOtp(['', '', '', '', '', '']);
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch {
      setError('Verification failed. Please try again.');
    }
    setIsLoading(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>

        <h2 className={styles.title}>
          {step === 1 ? 'Welcome to ReadyBite' : 'Verify Mobile'}
        </h2>
        <p className={styles.subtitle}>
          {step === 1
            ? 'Login or Signup to manage your table bookings.'
            : `Enter the 6-digit code sent to +91 ${phone}`}
        </p>

        {step === 2 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,107,0,0.1), rgba(255,107,0,0.05))',
            border: '1px solid rgba(255,107,0,0.3)',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '16px',
            fontSize: '13px',
            color: 'var(--text-primary)',
            textAlign: 'center',
          }}>
            🔑 Demo OTP: <strong style={{ color: 'var(--primary)', fontSize: '16px', letterSpacing: '4px' }}>123456</strong>
          </div>
        )}

        {error && (
          <div style={{ color: 'var(--error)', fontSize: '13px', marginBottom: '16px', background: 'var(--status-risk)', padding: '10px 14px', borderRadius: '8px' }}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="animate-fade">
            <div className={styles.formGroup}>
              <label className={styles.label}>Mobile Number</label>
              <div className={styles.inputWrapper}>
                <span className={styles.countryCode}>+91</span>
                <input
                  type="tel"
                  className={styles.input}
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  autoFocus
                />
              </div>
            </div>

            <Button
              fullWidth
              size="lg"
              style={{ marginTop: '32px' }}
              disabled={phone.length < 10 || isLoading}
              onClick={handleSendOtp}
            >
              {isLoading ? 'Sending OTP...' : 'Get OTP via Firebase'}
            </Button>

            <div className={styles.adminToggle} style={{ marginTop: '24px' }}>
              Are you a restaurant partner?{' '}
              <Link href="/admin/login" onClick={onClose} style={{ color: 'var(--primary)', fontWeight: '700' }}>
                Login here
              </Link>
            </div>
          </div>
        ) : (
          <div className="animate-fade">
            <div className={styles.otpContainer}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  className={styles.otpInput}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  maxLength={1}
                />
              ))}
            </div>

            <Button
              fullWidth
              size="lg"
              style={{ marginTop: '32px' }}
              disabled={otp.join('').length < 6 || isLoading}
              onClick={handleVerifyOtp}
            >
              {isLoading ? 'Verifying...' : 'Verify & Login'}
            </Button>

            <p
              className={styles.adminToggle}
              style={{ marginTop: '16px', cursor: 'pointer' }}
              onClick={() => { setStep(1); setError(''); }}
            >
              Change Phone Number
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
