'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Restaurant } from '@/lib/smart-engine';
import { SmartStatus } from './SmartStatus';
import { Button } from './Button';
import styles from '@/app/page.module.css';

interface HomeSearchProps {
  restaurants: Restaurant[];
}

export const HomeSearch: React.FC<HomeSearchProps> = ({ restaurants }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRestaurants = restaurants.filter((res) => {
    const query = searchQuery.toLowerCase();
    return (
      res.name.toLowerCase().includes(query) ||
      res.cuisine.toLowerCase().includes(query) ||
      res.location.toLowerCase().includes(query)
    );
  });

  return (
    <>
      {/* Search Bar in Hero */}
      <div className={styles.searchContainer}>
        <input 
          type="text" 
          placeholder="Search for 'Paradise' or 'Biryani'..." 
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button size="md">Search</Button>
      </div>

      {/* Restaurant List Section */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                {searchQuery ? `Results for "${searchQuery}"` : 'Top Restaurants near you'}
              </h2>
              <p className={styles.sectionText}>Detecting live supply chain health across Tirupati</p>
            </div>
            {!searchQuery && (
              <Link href="/explore">
                <Button variant="ghost">View All</Button>
              </Link>
            )}
          </div>

          {filteredRestaurants.length > 0 ? (
            <div className={styles.restaurantsGrid}>
              {filteredRestaurants.map((res) => (
                <Link href={`/restaurant/${res.id}`} key={res.id} className={styles.restaurantCard}>
                  <div className={styles.imageContainer}>
                    <img src={res.image} alt={res.name} className={styles.resImage} />
                    <div className={styles.loadBadge}>
                      <SmartStatus load={res.currentLoad} />
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.resCardTitle}>{res.name}</h3>
                      <span className={styles.rating}>★ {res.rating}</span>
                    </div>
                    <p className={styles.cuisine}>{res.cuisine} • {res.location}</p>
                    
                    <div className={styles.footer}>
                      <div className={styles.waitTime}>
                        ⏱️ Wait: <span className={styles.waitLabel}>{res.waitTime} mins</span>
                      </div>
                      <Button size="sm" variant="outline">View Menu</Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <h3>No restaurants found matching "{searchQuery}"</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Try searching for another cuisine or location.</p>
              <Button 
                variant="outline" 
                style={{ marginTop: '24px' }}
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
