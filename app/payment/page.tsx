'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getBookingById, updateBookingStatus, BookingData } from '@/lib/firestore';
import { Button } from '@/components/Button';
import styles from './Payment.module.css';

function PaymentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState<'CARD' | 'UPI'>('UPI');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!id) {
      router.push('/');
      return;
    }

    getBookingById(id).then((data) => {
      if (data) {
        setBooking(data);
      } else {
        router.push('/');
      }
      setLoading(false);
    });
  }, [id, router]);

  const handlePayment = async () => {
    if (!id || !booking) return;
    setProcessing(true);
    
    // Simulate gateway delay
    await new Promise(r => setTimeout(r, 1500));
    
    await updateBookingStatus(id, 'CONFIRMED');
    
    // Redirect to confirmation
    router.push(`/confirmation?id=${id}`);
  };

  if (loading) {
    return (
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
        <p>Loading gateway...</p>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Complete Payment</h1>
        <p className={styles.subtitle}>Pay directly via our secure gateway</p>
      </div>

      <div className={styles.summaryCard}>
        <h3 style={{ marginBottom: '16px' }}>Order Summary</h3>
        <div className={styles.row}>
          <span>Restaurant</span>
          <span>{booking.restaurantName}</span>
        </div>
        <div className={styles.row}>
          <span>Guests</span>
          <span>{booking.guests} People</span>
        </div>
        {booking.items.map((item, i) => (
          <div key={i} className={styles.row}>
            <span>{item.name}</span>
            <span>₹{item.price}</span>
          </div>
        ))}
        <div className={`${styles.row} ${styles.total}`}>
          <span>Total Amount</span>
          <span>₹{booking.totalAmount}</span>
        </div>
      </div>

      <div className={styles.paymentMethods}>
        <div 
          className={`${styles.method} ${method === 'UPI' ? styles.active : ''}`}
          onClick={() => setMethod('UPI')}
        >
          UPI / QR
        </div>
        <div 
          className={`${styles.method} ${method === 'CARD' ? styles.active : ''}`}
          onClick={() => setMethod('CARD')}
        >
          Credit/Debit Card
        </div>
      </div>

      <Button fullWidth size="lg" onClick={handlePayment} disabled={processing}>
        {processing ? 'Processing...' : `Pay ₹${booking.totalAmount} Securely`}
      </Button>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <main className="section bg-main" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <Suspense fallback={<div className={styles.loader}><div className={styles.spinner}></div></div>}>
        <PaymentForm />
      </Suspense>
    </main>
  );
}
