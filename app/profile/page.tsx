'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { subscribeToUserBookings, BookingData } from '@/lib/firestore';
import styles from './Profile.module.css';

export default function ProfilePage() {
  const { user, isLoading, logout, updateProfile } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingData[]>([]);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Redirect to home if not logged in
  useEffect(() => {
    if (!isLoading && !user) router.push('/');
  }, [user, isLoading, router]);

  // Prefill edit form when user loads
  useEffect(() => {
    if (user) {
      setEditName(user.displayName ?? '');
      setEditEmail(user.email ?? '');
    }
  }, [user]);

  // Live Firestore bookings
  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToUserBookings(user.uid, setBookings);
    return unsub;
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMsg('');
    await updateProfile({ displayName: editName });
    setIsSaving(false);
    setSaveMsg('Profile updated! ✅');
    setIsEditing(false);
    setTimeout(() => setSaveMsg(''), 3000);
  };

  if (isLoading || !user) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading profile...</p>
      </div>
    );
  }

  const totalSpent = bookings.reduce((s, b) => s + (b.totalAmount ?? 0), 0);
  const totalItems = bookings.reduce((s, b) => s + b.items.length, 0);
  const displayName = user.displayName || user.name || (user.phone ? user.phone.slice(-4) : 'U');

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {saveMsg && (
          <div style={{
            background: '#DCFCE7', color: '#15803D', border: '1px solid #BBF7D0',
            borderRadius: '10px', padding: '12px 20px', marginBottom: '20px',
            fontWeight: '600', fontSize: '14px', textAlign: 'center',
          }}>
            {saveMsg}
          </div>
        )}

        {/* Profile Header Card */}
        <div className={styles.profileCard}>
          <div className={styles.avatarLarge}>{displayName.slice(0, 2).toUpperCase()}</div>

          <div className={styles.profileInfo}>
            {isEditing ? (
              /* ── Edit Mode ── */
              <div className={styles.editForm}>
                <div className={styles.editGroup}>
                  <label className={styles.editLabel}>Display Name</label>
                  <input
                    className={styles.editInput}
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="Your name"
                    autoFocus
                  />
                </div>
                <div className={styles.editGroup}>
                  <label className={styles.editLabel}>Mobile / Contact</label>
                  <input
                    className={styles.editInput}
                    value={user.phone ?? user.email ?? ''}
                    disabled
                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                  />
                  <span className={styles.editHint}>Phone number cannot be changed</span>
                </div>
                <div className={styles.editActions}>
                  <button className={styles.saveBtn} onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* ── View Mode ── */
              <>
                <h1 className={styles.profileName}>{displayName}</h1>
                <p className={styles.profilePhone}>
                  📱 {user.phone ?? user.email ?? 'ReadyBite User'}
                </p>
                <span className={styles.roleBadge}>
                  {user.role === 'ADMIN' ? '🏪 Restaurant Admin' : '👤 Customer'}
                </span>
              </>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
            {!isEditing && (
              <button
                className={styles.editProfileBtn}
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile
              </button>
            )}
            <button className={styles.logoutBtn} onClick={handleLogout}>Sign Out</button>
          </div>
        </div>

        {/* Stats Row */}
        {user.role === 'USER' && (
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🍽️</div>
              <div className={styles.statNum}>{bookings.length}</div>
              <div className={styles.statLabel}>Total Bookings</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>₹</div>
              <div className={styles.statNum}>₹{totalSpent.toLocaleString()}</div>
              <div className={styles.statLabel}>Total Spent</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🛒</div>
              <div className={styles.statNum}>{totalItems}</div>
              <div className={styles.statLabel}>Items Pre-ordered</div>
            </div>
          </div>
        )}

        {/* Admin shortcut */}
        {user.role === 'ADMIN' && (
          <div style={{ marginBottom: '28px' }}>
            <Link href="/admin" style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: '#0F172A', color: 'white', padding: '20px 28px',
              borderRadius: '16px', textDecoration: 'none', fontWeight: '700', fontSize: '16px',
            }}>
              <span style={{ fontSize: '24px' }}>⚙️</span>
              Go to Supply Chain Control Center
              <span style={{ marginLeft: 'auto' }}>→</span>
            </Link>
          </div>
        )}

        {/* Booking History */}
        {user.role === 'USER' && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              My Bookings
              <span className={styles.liveDot}>Firestore Live</span>
            </div>

            {bookings.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🍽️</div>
                <p className={styles.emptyText}>No bookings yet. Find a restaurant and pre-order your meal!</p>
                <Link href="/" style={{
                  display: 'inline-block', background: 'var(--primary-gradient)',
                  color: 'white', padding: '12px 28px', borderRadius: '999px',
                  fontWeight: '700', textDecoration: 'none', fontSize: '14px',
                }}>
                  Browse Restaurants
                </Link>
              </div>
            ) : (
              bookings.map((b) => (
                <div key={b.id} className={styles.bookingCard}>
                  <div className={styles.bookingIconBox}>🍛</div>
                  <div className={styles.bookingDetails}>
                    <div className={styles.bookingRestaurant}>{b.restaurantName}</div>
                    <div className={styles.bookingMeta}>
                      {b.guests} guests · {b.items.length} items · ₹{b.totalAmount}
                    </div>
                    <div className={styles.bookingMeta} style={{ marginTop: '2px', fontSize: '12px' }}>
                      Prep starts at {b.prepStartTime}
                    </div>
                  </div>
                  <div className={styles.bookingRight}>
                    <div className={styles.bookingTime}>{b.arrivalTime}</div>
                    <span className={`${styles.bookingStatus} ${styles[b.status.toLowerCase()]}`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
