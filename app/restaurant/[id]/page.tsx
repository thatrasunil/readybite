import React from 'react';
import { RESTAURANTS } from "@/lib/smart-engine";
import { SmartStatus } from "@/components/SmartStatus";
import { RestaurantBooking } from "@/components/RestaurantBooking";
import styles from "./RestaurantDetail.module.css";
import { notFound } from "next/navigation";

export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const restaurant = RESTAURANTS.find(r => r.id === id);
  
  if (!restaurant) {
    notFound();
  }

  return (
    <main>
      <header className={styles.header}>
        <div className="container">
          <div className={styles.banner}>
            <img src={restaurant.image} alt={restaurant.name} className={styles.bannerImg} />
          </div>
          
          <div className={styles.info}>
            <div>
              <div className={styles.meta}>
                <span>{restaurant.cuisine}</span> • <span>{restaurant.location}</span>
                <span className={styles.rating}>★ {restaurant.rating}</span>
              </div>
              <h1 className={styles.infoTitle}>{restaurant.name}</h1>
            </div>
            
            <SmartStatus load={restaurant.currentLoad} showDetails />
          </div>
        </div>
      </header>

      <section className="section bg-main">
        <div className="container">
          <div className={`${styles.mapGrid} ${restaurant.currentLoad > 70 ? styles.mapGrid2Col : styles.mapGrid1Col}`}>
            {/* Detailed Supply Chain Warning for Risk/Peak */}
            {restaurant.currentLoad > 70 && (
              <div className={styles.smartSection} style={{ marginTop: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '24px' }}>⚠️</span>
                  Supply Chain Disruption Detected
                </h3>
                <p style={{ marginTop: '12px', lineHeight: '1.6' }}>Our prediction engine expects a kitchen overload at {restaurant.name} during your selected time. We have dynamically adjusted available slots to minimize delay.</p>
              </div>
            )}

            {/* Google Maps Embed */}
            <div className={styles.mapSection} style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', height: '220px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(restaurant.name + ' ' + restaurant.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              ></iframe>
            </div>
          </div>

          <RestaurantBooking restaurant={restaurant} />
        </div>
      </section>
    </main>
  );
}
