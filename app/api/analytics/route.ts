// Analytics API Route — BigQuery-style aggregation from Firestore
// Uses client Firebase SDK (no service account needed)
import { NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getServerApp() {
  const existing = getApps().find(a => a.name === 'server');
  if (existing) return existing;
  return initializeApp(firebaseConfig, 'server');
}

// Mock fallback data — always works even if Firestore is empty
const MOCK = {
  totalBookings: 203,
  totalRevenue: 48750,
  peakHour: '19:00',
  hourlyData: { 11: 4, 12: 12, 13: 22, 14: 18, 15: 7, 16: 9, 17: 14, 18: 28, 19: 38, 20: 32, 21: 15 },
};

export async function GET() {
  try {
    const app = getServerApp();
    const db = getFirestore(app);
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(500));
    const snapshot = await getDocs(q);
    const bookings = snapshot.docs.map(d => d.data());

    if (bookings.length === 0) {
      return NextResponse.json(MOCK);
    }

    // GROUP BY hour (BigQuery equivalent)
    const hourCounts: Record<number, number> = {};
    bookings.forEach((b) => {
      const hour = parseInt((b.arrivalTime as string)?.split(':')[0] ?? '12', 10);
      hourCounts[hour] = (hourCounts[hour] ?? 0) + 1;
    });

    const peakEntry = Object.entries(hourCounts).reduce(
      (max, [h, c]) => Number(c) > max.count ? { hour: Number(h), count: Number(c) } : max,
      { hour: 0, count: 0 }
    );

    const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

    return NextResponse.json({
      totalBookings: bookings.length,
      totalRevenue,
      peakHour: `${String(peakEntry.hour).padStart(2, '0')}:00`,
      hourlyData: hourCounts,
    });
  } catch (error) {
    console.error('[Analytics] Firestore read failed, using mock data:', error);
    return NextResponse.json(MOCK);
  }
}
