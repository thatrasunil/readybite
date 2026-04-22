'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { RESTAURANTS } from "@/lib/smart-engine";
import { SmartStatus, Button, HomeSearch } from "@/components";
import { useAuth } from '@/lib/auth-context';
import { subscribeToUserBookings, BookingData } from '@/lib/firestore';

export default function Home() {
  const { user } = useAuth();
  const [myBookings, setMyBookings] = useState<BookingData[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToUserBookings(user.uid, setMyBookings);
    return unsub;
  }, [user]);

  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          {user ? (
            <div className="animate-fade" style={{ marginBottom: '40px' }}>
              <h1 className={styles.heroTitle} style={{ fontSize: '40px' }}>
                Welcome back, <span>User {user.name}</span>
              </h1>
              <p className={styles.heroText}>Your dining supply chain is being optimized in real-time.</p>
              
              {/* Active Dining Queue — from Firestore */}
              <div className={styles.diningQueue}>
                <div className={styles.queueTitle}>
                  <div className={styles.pulseDot}></div>
                  Your Active Dining Queue
                  <span style={{ fontSize: '12px', color: '#22C55E', fontWeight: '600' }}>● Firestore Live</span>
                </div>
                {myBookings.length === 0 ? (
                  <div className={styles.queueCard} style={{ justifyContent: 'center', color: 'var(--text-secondary)' }}>
                    No active bookings. Browse restaurants to pre-order!
                  </div>
                ) : (
                  myBookings.slice(0, 3).map((b) => (
                    <Link key={b.id} href={`/confirmation?id=${b.id}`} className={styles.queueCard}>
                      <div className={styles.queueInfo}>
                        <h4>{b.restaurantName}</h4>
                        <p>{b.guests} People • {b.items.length} Items • ₹{b.totalAmount}</p>
                      </div>
                      <div className={styles.queueStatus}>
                        <span className={styles.timeTag}>{b.arrivalTime}</span>
                        <span className={styles.statusLabel}>{b.status}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          ) : (
            <>
              <h1 className={`${styles.heroTitle} animate-fade`}>Book a Table.<br />Pre-order Food.<br /><span>Zero Wait Time.</span></h1>
              <p className={`${styles.heroText} animate-fade`}>ReadyBite optimizes the dining supply chain, predicting demand and detecting disruptions before they impact your experience.</p>
            </>
          )}
          
          <HomeSearch restaurants={RESTAURANTS} />
        </div>
      </section>

      {/* Supply Chain Intelligence Section */}
      <section className="section" style={{ backgroundColor: '#fff' }}>
        <div className="container">
          <div className={styles.supplyChainBanner}>
            <div className={styles.bannerText}>
              <h2 className={styles.bannerTitle}>Smart Supply Chain System</h2>
              <p className={styles.bannerDescription}>We balance kitchen load, predict peak disruptions, and dynamically adjust preparation times to ensure your food is ready the second you arrive.</p>
              
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>15m</span>
                  <span className={styles.statLabel}>Avg. Time Saved</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>ZERO</span>
                  <span className={styles.statLabel}>Waiting Time</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>99%</span>
                  <span className={styles.statLabel}>Prep Accuracy</span>
                </div>
              </div>
            </div>
            <div className={styles.bannerIllustration}>
               <img src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=800&q=80" alt="Supply Chain Illustration" style={{ width: '300px', borderRadius: '20px' }} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
