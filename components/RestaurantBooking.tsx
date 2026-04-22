'use client';

import React, { useState } from 'react';
import { Restaurant, MENU_ITEMS, getSmartSlotRecommendation, calculatePrepStartTime } from '@/lib/smart-engine';
import { Button } from './Button';
import styles from '@/app/restaurant/[id]/RestaurantDetail.module.css';

interface Props {
  restaurant: Restaurant;
}

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { LoginModal } from './LoginModal';
import { addBooking } from '@/lib/firestore';

export const RestaurantBooking: React.FC<Props> = ({ restaurant }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedTime, setSelectedTime] = useState('19:30');
  const [guests, setGuests] = useState(2);
  const [cart, setCart] = useState<typeof MENU_ITEMS>([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const handleBooking = async () => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }
    setIsBooking(true);
    try {
      const prepStartTime = cart.length > 0
        ? calculatePrepStartTime(selectedTime, Math.max(...cart.map(i => i.prepTime)))
        : selectedTime;

      const bookingId = await addBooking({
        userId: user.uid,
        userPhone: user.phone ?? user.email ?? 'unknown',
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        arrivalTime: selectedTime,
        guests,
        items: cart.map(i => ({ name: i.name, price: i.price })),
        totalAmount: cart.reduce((s, i) => s + i.price, 0),
        status: 'CONFIRMED',
        prepStartTime,
      });
      router.push(`/confirmation?id=${bookingId}&time=${selectedTime}&restaurant=${encodeURIComponent(restaurant.name)}`);
    } catch (err) {
      console.error('Booking failed', err);
      // Fallback to confirmation page even if Firestore write fails
      router.push('/confirmation');
    }
    setIsBooking(false);
  };

  const addToCart = (item: typeof MENU_ITEMS[0]) => {
    setCart([...cart, item]);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const totalPrepTime = cart.length > 0 ? Math.max(...cart.map(i => i.prepTime)) : 0;
  
  const recommendedSlot = getSmartSlotRecommendation(selectedTime, restaurant.currentLoad);
  const prepStartTime = calculatePrepStartTime(selectedTime, totalPrepTime);

  return (
    <div className={styles.contentGrid}>
      {/* Menu Column */}
      <div className={styles.menuSection}>
        <h2 className={styles.menuSectionTitle}>Choose your Pre-orders</h2>
        <div className={styles.menuGrid}>
          {MENU_ITEMS.map((item) => (
            <div key={item.id} className={styles.menuItem}>
              <img src={item.image} alt={item.name} className={styles.itemImage} />
              <div className={styles.itemDetails}>
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <div className={styles.price}>₹{item.price}</div>
                <span className={styles.prepTime}>⏱️ Prep: {item.prepTime} mins</span>
              </div>
              <Button size="sm" variant="outline" onClick={() => addToCart(item)}>+ Add</Button>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Column */}
      <div className={styles.sidebar}>
        <div className={styles.bookingCard}>
          <h3 className={styles.bookingCardTitle}>Book a Table</h3>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Date</label>
            <select className={styles.formInput}>
              <option>Today, 22 April</option>
              <option>Tomorrow, 23 April</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Arrival Time</label>
            <input 
              type="time" 
              className={styles.formInput}
              value={selectedTime} 
              onChange={(e) => setSelectedTime(e.target.value)} 
            />
          </div>

          {recommendedSlot && (
            <div className={styles.recommendationBox}>
              <div>
                <strong>⚡ Smart Suggestion:</strong>
                <p>The {selectedTime} slot is peak. Book for {recommendedSlot} for a smoother experience.</p>
                <Button size="sm" variant="ghost" onClick={() => setSelectedTime(recommendedSlot)}>Switch to {recommendedSlot}</Button>
              </div>
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Guests</label>
            <select className={styles.formInput} value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
              <option value={1}>1 Person</option>
              <option value={2}>2 People</option>
              <option value={3}>3 People</option>
              <option value={4}>4 People</option>
            </select>
          </div>

          <div className={styles.cartSummary}>
            <h4>Pre-order Summary</h4>
            {cart.map((item, idx) => (
              <div key={idx} className={styles.cartItem}>
                <span>{item.name}</span>
                <span>₹{item.price}</span>
              </div>
            ))}
            
            {cart.length > 0 && (
              <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                ✨ We will start cooking at <strong>{prepStartTime}</strong> to match your arrival.
              </div>
            )}

            <div className={styles.total}>
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <Button fullWidth size="lg" style={{ marginTop: '24px' }} onClick={handleBooking}>
            {user ? 'Confirm Booking' : 'Login to Book & Pre-order'}
          </Button>
        </div>
      </div>
      
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
};
