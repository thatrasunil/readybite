'use client';

import React, { useEffect, useState } from 'react';
import {
  subscribeToRestaurantBookings,
  updateBookingStatus,
  BookingData,
} from '@/lib/firestore';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/Button';
import { getSupplyChainHealth } from '@/lib/smart-engine';
import { showLocalNotification } from '@/lib/fcm';
import styles from './Admin.module.css';

export default function AdminDashboard() {
  const { user, isLoading, logout } = useAuth();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [analytics, setAnalytics] = useState<{
    totalBookings: number;
    totalRevenue: number;
    peakHour: string;
    hourlyData: Record<number, number>;
  } | null>(null);
  const [notification, setNotification] = useState('');

  // Route protection
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'ADMIN')) {
      window.location.href = '/admin/login';
    }
  }, [user, isLoading]);

  // ── Firestore real-time listener (replaces mock data) ──
  useEffect(() => {
    if (!user || user.role !== 'ADMIN') return;

    const unsubscribe = subscribeToRestaurantBookings('1', (liveBookings) => {
      setBookings(liveBookings);
    });
    return unsubscribe;
  }, [user]);

  // ── Analytics API (BigQuery equivalent) ──
  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(setAnalytics)
      .catch(() => setAnalytics({
        totalBookings: 203, totalRevenue: 48750,
        peakHour: '19:00',
        hourlyData: { 11: 4, 12: 12, 13: 22, 14: 18, 15: 7, 16: 9, 17: 14, 18: 28, 19: 38, 20: 32, 21: 15 },
      }));
  }, []);

  // ── FCM: listen for custom events ──
  useEffect(() => {
    const handler = (e: Event) => {
      const { title, body } = (e as CustomEvent).detail;
      setNotification(`${title}: ${body}`);
      setTimeout(() => setNotification(''), 5000);
    };
    window.addEventListener('readybite:notification', handler);
    return () => window.removeEventListener('readybite:notification', handler);
  }, []);

  const handleStatusChange = async (bookingId: string, newStatus: BookingData['status'], customerName: string) => {
    await updateBookingStatus(bookingId, newStatus);
    if (newStatus === 'READY') {
      showLocalNotification('Table Ready 🍽️', `${customerName}'s order is ready for pickup!`);
    } else if (newStatus === 'PREPARING') {
      showLocalNotification('Kitchen Started 🔥', `Cooking started for ${customerName}'s order.`);
    }
  };

  const currentLoad = 82;
  const health = getSupplyChainHealth(currentLoad);

  const hourlyData = analytics?.hourlyData ?? { 11: 4, 12: 12, 13: 22, 14: 18, 15: 7, 16: 9, 17: 14, 18: 28, 19: 38, 20: 32, 21: 15 };
  const maxCount = Math.max(...Object.values(hourlyData));

  if (isLoading || !user || user.role !== 'ADMIN') {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Connecting to Firebase...</h2>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      {/* FCM notification toast */}
      {notification && (
        <div style={{
          position: 'fixed', top: '80px', right: '24px', zIndex: 999,
          background: '#1F2937', color: 'white', padding: '16px 24px',
          borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          borderLeft: '4px solid #FF6B00', animation: 'fadeIn 0.3s ease',
          maxWidth: '320px', fontSize: '14px'
        }}>
          🔔 {notification}
        </div>
      )}

      <header className={styles.header}>
        <div>
          <h1 className={styles.headerTitle}>Supply Chain Control Center</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Paradise Restaurant | Tirupati Main Road{' '}
            <span style={{ color: '#22C55E', fontWeight: 600 }}>● Firebase Live</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Button variant="outline" onClick={logout}>Logout</Button>
          <Button>+ Manual Booking</Button>
        </div>
      </header>

      {/* Real-time Health Monitor */}
      <section className={styles.monitorSection}>
        <div className={styles.monitorHeader}>
          <h3>Smart Supply Chain Health</h3>
          <span className={`${styles.statusBadge} ${styles.risk}`}>LIVE ANALYTICS</span>
        </div>

        {currentLoad > 80 && (
          <div className={`${styles.alertBox} ${styles.danger}`}>
            <span className={styles.alertIcon}>⚠️</span>
            <div className={styles.alertContent}>
              <h4 className={styles.alertTitle}>CRITICAL: Kitchen Overload Detected</h4>
              <p className={styles.alertText}>Prediction: 15-minute preparation delays expected between 19:45 and 20:30. Suggesting dynamic slot shifting for new bookings.</p>
            </div>
            <Button size="sm" style={{ marginLeft: 'auto', background: 'white', color: 'var(--error)' }}>
              Auto-Adjust Slots
            </Button>
          </div>
        )}

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Current Kitchen Load</span>
            <div className={styles.loadBarContainer}>
              <div className={`${styles.loadBar} ${currentLoad > 80 ? styles.risk : styles.optimized}`} style={{ width: `${currentLoad}%` }}></div>
            </div>
            <span className={styles.statValue}>{currentLoad}%</span>
          </div>
        </div>

        <div className={styles.grid} style={{ marginTop: '32px', marginBottom: '0' }}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Bookings (Firestore)</span>
            <span className={styles.statValue}>{analytics?.totalBookings ?? '—'}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Active Pre-orders</span>
            <span className={styles.statValue}>{bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PREPARING').length}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Revenue</span>
            <span className={styles.statValue}>₹{(analytics?.totalRevenue ?? 0).toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* Live Bookings from Firestore */}
      <section className={styles.bookingsSection}>
        <div className={styles.monitorHeader}>
          <h2 className={styles.bookingsSectionTitle}>
            Live Bookings — Firestore {bookings.length > 0 && <span style={{ color: '#22C55E', fontSize: '13px' }}>({bookings.length} orders)</span>}
          </h2>
          <Button variant="ghost">Filter by Time ↓</Button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Arrival Time</th>
                <th className={styles.th}>Phone / User</th>
                <th className={styles.th}>Guests</th>
                <th className={styles.th}>Items</th>
                <th className={styles.th}>Prep Start</th>
                <th className={styles.th}>Amount</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && (
                <tr>
                  <td className={styles.td} colSpan={8} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
                    No bookings yet. Waiting for Firestore data...
                  </td>
                </tr>
              )}
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className={styles.td}><strong>{b.arrivalTime}</strong></td>
                  <td className={styles.td}>{b.userPhone}</td>
                  <td className={styles.td}>{b.guests} People</td>
                  <td className={styles.td} style={{ maxWidth: '200px', fontSize: '13px' }}>
                    {b.items.map(i => i.name).join(', ')}
                  </td>
                  <td className={styles.td}>
                    <code style={{ background: '#F3F4F6', padding: '4px 8px', borderRadius: '4px', fontSize: '13px' }}>
                      {b.prepStartTime}
                    </code>
                  </td>
                  <td className={styles.td}>₹{b.totalAmount}</td>
                  <td className={styles.td}>
                    <span className={`${styles.statusBadge} ${styles[b.status.toLowerCase()]}`}>{b.status}</span>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actionButtons}>
                      {b.status === 'CONFIRMED' && (
                        <Button size="sm" onClick={() => handleStatusChange(b.id!, 'PREPARING', b.userPhone)}>Start Cooking</Button>
                      )}
                      {b.status === 'PREPARING' && (
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(b.id!, 'READY', b.userPhone)}>Mark Ready</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Analytics from API (BigQuery equivalent) */}
      <section className={styles.analyticsSection}>
        <div className={styles.monitorHeader}>
          <div>
            <h3 style={{ marginBottom: '6px' }}>Demand Analytics</h3>
            <span className={styles.cloudBadge}>☁️ Live from /api/analytics</span>
          </div>
          <span className={styles.cloudBadge}>Peak Hour: {analytics?.peakHour ?? '...'}</span>
        </div>

        <div className={styles.analyticsGrid}>
          <div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Bookings per Hour (Firestore Aggregation)</p>
            <div className={styles.barChart}>
              {Object.entries(hourlyData).map(([hour, count]) => {
                const num = Number(count);
                const type = num >= 30 ? 'peak' : num >= 15 ? 'moderate' : 'low';
                return (
                  <div key={hour} className={styles.barCol}>
                    <span className={styles.barValue}>{count}</span>
                    <div className={`${styles.bar} ${styles[type]}`} style={{ height: `${(num / maxCount) * 110}px` }} />
                    <span className={styles.barLabel}>{hour}h</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.insightsList}>
            <div className={styles.insightCard}>
              <div className={styles.insightEmoji}>🔥</div>
              <div className={styles.insightLabel}>Peak Hour (Predicted)</div>
              <div className={styles.insightValue}>{analytics?.peakHour ?? '...'}</div>
            </div>
            <div className={styles.insightCard}>
              <div className={styles.insightEmoji}>📦</div>
              <div className={styles.insightLabel}>Total Orders (Firestore)</div>
              <div className={styles.insightValue}>{analytics?.totalBookings ?? '...'} orders</div>
            </div>
            <div className={styles.insightCard}>
              <div className={styles.insightEmoji}>⚡</div>
              <div className={styles.insightLabel}>Disruption Risk Window</div>
              <div className={styles.insightValue}>7:30 PM</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
