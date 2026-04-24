import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  where,
  Timestamp,
} from 'firebase/firestore';

export interface BookingData {
  id?: string;
  userId: string;
  userPhone: string;
  restaurantId: string;
  restaurantName: string;
  arrivalTime: string;
  guests: number;
  items: { name: string; price: number }[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'CANCELLED';
  prepStartTime: string;
  createdAt?: Timestamp;
}

// ── Bookings ───────────────────────────────────────────
export const addBooking = async (booking: Omit<BookingData, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'bookings'), {
    ...booking,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getBookingById = async (bookingId: string): Promise<BookingData | null> => {
  const docSnap = await getDoc(doc(db, 'bookings', bookingId));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as BookingData;
  }
  return null;
};

export const getUserBookings = async (userId: string): Promise<BookingData[]> => {
  const q = query(
    collection(db, 'bookings'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as BookingData));
};

export const getRestaurantBookings = async (restaurantId: string): Promise<BookingData[]> => {
  const q = query(
    collection(db, 'bookings'),
    where('restaurantId', '==', restaurantId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as BookingData));
};

export const updateBookingStatus = async (bookingId: string, status: BookingData['status']) => {
  await updateDoc(doc(db, 'bookings', bookingId), { status });
};

// ── Live Listeners ─────────────────────────────────────
export const subscribeToRestaurantBookings = (
  restaurantId: string,
  callback: (bookings: BookingData[]) => void
) => {
  const q = query(
    collection(db, 'bookings'),
    where('restaurantId', '==', restaurantId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const bookings = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as BookingData));
    callback(bookings);
  });
};

export const subscribeToUserBookings = (
  userId: string,
  callback: (bookings: BookingData[]) => void
) => {
  const q = query(
    collection(db, 'bookings'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const bookings = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as BookingData));
    callback(bookings);
  });
};
