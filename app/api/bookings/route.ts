// Booking API Route — acts as a Cloud Function (serverless)
// Uses client Firebase SDK (no service account needed)
import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, limit } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getServerApp() {
  // Use a separate named app instance for server-side to avoid conflicts
  const existing = getApps().find(a => a.name === 'server');
  if (existing) return existing;
  return initializeApp(firebaseConfig, 'server');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, restaurantId, restaurantName, arrivalTime, guests, items, totalAmount } = body;

    // Smart prep-time calculation (Cloud Function logic)
    const totalPrepTime = items?.length > 0
      ? Math.max(...items.map((i: { prepTime?: number }) => i.prepTime ?? 20))
      : 20;

    const [h, m] = (arrivalTime ?? '19:00').split(':').map(Number);
    const prepMinutes = h * 60 + m - totalPrepTime;
    const prepH = Math.floor(Math.max(prepMinutes, 0) / 60);
    const prepM = Math.max(prepMinutes, 0) % 60;
    const prepStartTime = `${String(prepH).padStart(2, '0')}:${String(prepM).padStart(2, '0')}`;

    const app = getServerApp();
    const db = getFirestore(app);
    const ref = await addDoc(collection(db, 'bookings'), {
      userId,
      restaurantId,
      restaurantName,
      arrivalTime,
      guests,
      items,
      totalAmount,
      prepStartTime,
      status: 'CONFIRMED',
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ bookingId: ref.id, prepStartTime }, { status: 201 });
  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json({ error: 'Booking failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const restaurantId = searchParams.get('restaurantId');
  const userId = searchParams.get('userId');

  try {
    const app = getServerApp();
    const db = getFirestore(app);
    const col = collection(db, 'bookings');

    let q;
    if (restaurantId) {
      q = query(col, where('restaurantId', '==', restaurantId), orderBy('createdAt', 'desc'), limit(50));
    } else if (userId) {
      q = query(col, where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(50));
    } else {
      q = query(col, orderBy('createdAt', 'desc'), limit(50));
    }

    const snapshot = await getDocs(q);
    const bookings = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json({ bookings: [] });
  }
}
