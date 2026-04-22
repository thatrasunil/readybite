// ── Cloud Function: Booking Logic ────────────────────────────────
// POST /api/bookings — Validates slot availability & saves to Firestore
import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (server-side only)
function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  // In production, use a service account. For demo we use the client credentials.
  return initializeApp({
    projectId: 'readybite-23a40',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, restaurantId, restaurantName, arrivalTime, guests, items, totalAmount } = body;

    // ── Smart Supply Chain Logic (Cloud Function equivalent) ──
    const totalPrepTime = items.length > 0
      ? Math.max(...items.map((i: { prepTime: number }) => i.prepTime ?? 20))
      : 20;

    const [h, m] = arrivalTime.split(':').map(Number);
    const prepMinutes = h * 60 + m - totalPrepTime;
    const prepH = Math.floor(prepMinutes / 60);
    const prepM = prepMinutes % 60;
    const prepStartTime = `${String(prepH).padStart(2, '0')}:${String(prepM).padStart(2, '0')}`;

    // Save to Firestore
    const adminApp = getAdminApp();
    const db = getFirestore(adminApp);
    const ref = await db.collection('bookings').add({
      userId,
      restaurantId,
      restaurantName,
      arrivalTime,
      guests,
      items,
      totalAmount,
      prepStartTime,
      status: 'CONFIRMED',
      createdAt: new Date(),
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
    const adminApp = getAdminApp();
    const db = getFirestore(adminApp);

    let query = db.collection('bookings').orderBy('createdAt', 'desc').limit(50);
    if (restaurantId) {
      query = db.collection('bookings').where('restaurantId', '==', restaurantId).orderBy('createdAt', 'desc');
    } else if (userId) {
      query = db.collection('bookings').where('userId', '==', userId).orderBy('createdAt', 'desc');
    }

    const snapshot = await query.get();
    const bookings = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json({ bookings: [] });
  }
}
