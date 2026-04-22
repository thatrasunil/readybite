'use client';

import React, { useState, useEffect } from 'react';
import styles from './SplashScreen.module.css';

export const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [loadingText, setLoadingText] = useState('Initializing Smart Engine...');

  useEffect(() => {
    const textSequence = [
      { time: 1000, text: 'Detecting Live Disruptions...' },
      { time: 2000, text: 'Optimizing Supply Chain...' },
      { time: 3000, text: 'ReadyBite is Live.' },
    ];

    textSequence.forEach((step) => {
      setTimeout(() => setLoadingText(step.text), step.time);
    });

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <h1 className={styles.logo}>
            Ready<span className={styles.logoAccent}>Bite</span>
          </h1>
          <div className={styles.ripple}></div>
        </div>
        
        <div className={styles.statusContainer}>
          <div className={styles.loader}>
            <div className={styles.loaderBar}></div>
          </div>
          <p className={styles.statusText}>{loadingText}</p>
        </div>
      </div>
    </div>
  );
};
