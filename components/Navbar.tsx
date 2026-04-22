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

            {user ? (
              <div className={styles.userProfile}>
                <div className={styles.avatar}>
                  {user.name}
                </div>
                <div className={styles.dropdown}>
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
