'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './Confirmation.module.css';
import { Button } from '@/components/Button';
import { getBookingById, BookingData } from '@/lib/firestore';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getBookingById(id).then(data => {
        setBooking(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className={styles.container} style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading confirmation...</p>
      </div>
    );
  }

  const handlePrint = () => {
    if (id) {
      window.open(`/receipt?id=${id}`, '_blank');
    }
  };

  const displayTime = booking ? booking.arrivalTime : '19:30';
  const displayGuests = booking ? `${booking.guests} People` : '2 People';
  const displayRestaurant = booking ? booking.restaurantName : 'Paradise Restaurant';
  const displayId = booking ? `#${booking.id?.slice(-6).toUpperCase()}` : '#RB-9921';
  const prepTime = booking ? booking.prepStartTime : '19:30';

  return (
    <div className={styles.container}>
      <div className={styles.successIcon}>✓</div>
      <h1 className={styles.title}>Booking Confirmed!</h1>
      <p className={styles.subtitle}>We've alerted the kitchen. Your dining supply chain is now optimized.</p>
      
      <div className={styles.supplyChainMessage}>
        🍽️ Your food will be ready exactly at {displayTime} on arrival.
      </div>

      <div className={styles.qrPlaceholder}>
        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${id || 'ReadyBite-101'}`} alt="Booking QR" className={styles.qrImage} />
      </div>

      <div className={styles.bookingDetails}>
        <div className={styles.detailRow}>
          <span className={styles.label}>Restaurant</span>
          <span className={styles.value}>{displayRestaurant}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.label}>Time Slot</span>
          <span className={styles.value}>Today, {displayTime}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.label}>Prep Starts</span>
          <span className={styles.value}>{prepTime}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.label}>Table for</span>
          <span className={styles.value}>{displayGuests}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.label}>Booking ID</span>
          <span className={styles.value}>{displayId}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <Link href="/" style={{ flex: 1 }}>
          <Button fullWidth variant="outline">Back to Home</Button>
        </Link>
        <Button style={{ flex: 1 }} onClick={handlePrint} variant="primary">Print Receipt</Button>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <main className="section bg-main" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="container">
        <Suspense fallback={<div style={{height: '100vh'}} />}>
          <ConfirmationContent />
        </Suspense>
      </div>
    </main>
  );
}
