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
          {/* Detailed Supply Chain Warning for Risk/Peak */}
          {restaurant.currentLoad > 70 && (
            <div className={styles.smartSection}>
              <h3>⚠️ Supply Chain Disruption Detected</h3>
              <p>Our platform has detected high kitchen activity at {restaurant.name}. We have dynamically adjusted time slots to ensure your pre-order is not delayed.</p>
            </div>
          )}

          <RestaurantBooking restaurant={restaurant} />
        </div>
      </section>
    </main>
  );
}
