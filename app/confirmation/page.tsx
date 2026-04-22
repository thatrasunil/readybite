import React from 'react';
import Link from 'next/link';
import styles from './Confirmation.module.css';
import { Button } from '@/components/Button';

export default function ConfirmationPage() {
  return (
    <main className="section bg-main" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="container">
        <div className={styles.container}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.title}>Booking Confirmed!</h1>
          <p className={styles.subtitle}>We've alerted the kitchen. Your dining supply chain is now optimized.</p>
          
          <div className={styles.supplyChainMessage}>
            🍽️ Your food will be ready exactly at 19:30 on arrival.
          </div>

          <div className={styles.qrPlaceholder}>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ReadyBite-101" alt="Booking QR" className={styles.qrImage} />
          </div>

          <div className={styles.bookingDetails}>
            <div className={styles.detailRow}>
              <span className={styles.label}>Restaurant</span>
              <span className={styles.value}>Paradise Restaurant</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Time Slot</span>
              <span className={styles.value}>Today, 19:30</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Table for</span>
              <span className={styles.value}>2 People</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Booking ID</span>
              <span className={styles.value}>#RB-9921</span>
            </div>
          </div>

          <div className={styles.actions}>
            <Link href="/" style={{ flex: 1 }}>
              <Button fullWidth variant="outline">Back to Home</Button>
            </Link>
            <Button style={{ flex: 1 }}>Get Directions</Button>
          </div>
        </div>
      </div>
    </main>
  );
}
