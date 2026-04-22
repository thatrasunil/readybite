import React from 'react';
import { LoadStatus, getSupplyChainHealth } from '@/lib/smart-engine';
import styles from './SmartStatus.module.css';

interface SmartStatusProps {
  load: number;
  showDetails?: boolean;
}

export const SmartStatus: React.FC<SmartStatusProps> = ({ load, showDetails = false }) => {
  const health = getSupplyChainHealth(load);
  
  return (
    <div className={`${styles.container} ${styles[health.status.toLowerCase()]}`}>
      <div className={styles.header}>
        <span className={styles.dot}></span>
        <span className={styles.label}>{health.label}</span>
      </div>
      {showDetails && (
        <p className={styles.message}>{health.message}</p>
      )}
    </div>
  );
};
