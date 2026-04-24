'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getBookingById, BookingData } from '@/lib/firestore';
import styles from './Receipt.module.css';

function ReceiptContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getBookingById(id).then(data => {
        setBooking(data);
        setLoading(false);
        // Auto-print prompt after a slight delay
        setTimeout(() => {
          if (data) window.print();
        }, 500);
      });
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', fontFamily: 'monospace' }}>LOADING RECEIPT DATA...</div>;
  }

  // Fallback defaults if no booking found but we still want to preview the template
  const restaurantName = booking?.restaurantName || 'READYBITE DEMO RESTAURANT';
  const table = booking?.guests ? `Table for ${booking.guests}` : 'Table: Walk-in';
  const time = booking?.arrivalTime || new Date().toLocaleTimeString();
  const date = booking?.createdAt ? booking.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString();
  const items = booking?.items || [{ name: 'TEST ITEM', price: 0 }];
  const total = booking?.totalAmount || 0;
  const bookingIdStr = booking?.id ? booking.id.slice(-6).toUpperCase() : 'TEST00';

  return (
    <div className={styles.page}>
      <div className={styles.receipt}>
        <div className={styles.header}>
          <div className={styles.logo}>{restaurantName.toUpperCase()}</div>
          <div className={styles.address}>
            123 Culinary Avenue<br />
            Food District, FL 32004<br />
            Tel: 555-0199
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.infoRow}>
          <span>DATE: {date}</span>
          <span>TIME: {time}</span>
        </div>
        <div className={styles.infoRow}>
          <span>ORDER: {bookingIdStr}</span>
          <span>{table}</span>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.itemsHeader}>
          <span>ITEM</span>
          <span>AMT</span>
        </div>

        {items.map((item, idx) => (
          <div key={idx} className={styles.itemRow}>
            <span className={styles.itemCol}>{item.name.toUpperCase()}</span>
            <span className={styles.priceCol}>₹{item.price.toFixed(2)}</span>
          </div>
        ))}

        <div className={styles.divider}></div>

        <div className={styles.totalRow}>
          <span>TOTAL</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.footer}>
          THANK YOU FOR DINING WITH US!<br />
          PLEASE COME AGAIN
        </div>

        <div className={styles.barcode}>
          {/* Simulated barcode */}
          <div className={styles.barcodeImage}></div>
        </div>

        <button className={styles.printBtn} onClick={() => window.print()}>
          Print Receipt
        </button>
      </div>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', fontFamily: 'monospace' }}>LOADING...</div>}>
      <ReceiptContent />
    </Suspense>
  );
}
