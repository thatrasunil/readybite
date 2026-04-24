'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { LoginModal } from './LoginModal';
import { Button } from './Button';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <nav className={styles.nav}>
        <div className={`${styles.container} container`}>
          <Link href="/" className={styles.logo}>
            Ready<span className={styles.logoAccent}>Bite</span>
          </Link>
          
          <div className={styles.links}>
            <Link href="/" className={styles.navLink}>Browse</Link>
            
            {user?.role === 'ADMIN' ? (
              <Link href="/admin" className={`${styles.adminLink} ${styles.navLink}`}>Dashboard</Link>
            ) : (
              <Link href="/admin" className={`${styles.adminLink} ${styles.navLink}`}>For Restaurants</Link>
            )}

            <div className={styles.cartIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {/* Optional: badge for cart items count */}
              {/* <div className={styles.cartBadge}>2</div> */}
            </div>

            {user ? (
              <div className={styles.userProfile}>
                <Link href="/profile" className={styles.avatar} style={{ textDecoration: 'none' }}>
                  {user.name}
                </Link>
                <div className={styles.dropdown}>
                  <Link href="/profile" className={styles.dropdownItem} style={{ textDecoration: 'none', display: 'block' }}>
                    View Profile
                  </Link>
                  <button className={styles.dropdownItem} onClick={logout}>Logout</button>
                </div>
              </div>
            ) : (
              <Button size="sm" onClick={() => setIsLoginOpen(true)}>Login</Button>
            )}
          </div>
        </div>
      </nav>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </>
  );
};
