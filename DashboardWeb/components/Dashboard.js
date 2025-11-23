'use client';

import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/dataService';
import styles from './Dashboard.module.css';

export default function Dashboard({ onNavigate, refreshTrigger }) {
    const [stats, setStats] = useState({
        totalAlerts: 0,
        highPriorityAlerts: 0,
        availableEmployees: 0,
        criticalProducts: 0,
    });

    useEffect(() => {
        const newStats = getDashboardStats();
        setStats(newStats);
    }, [refreshTrigger]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Store Manager Dashboard</h1>
                <p>Real-time Store Overview</p>
            </header>

            <div className={styles.statsGrid}>
                <div
                    className={`${styles.statCard} ${styles.alerts}`}
                    onClick={() => onNavigate('alerts')}
                >
                    <div className={styles.statIcon}>🔔</div>
                    <div className={styles.statContent}>
                        <div className={styles.statValue}>{stats.totalAlerts}</div>
                        <div className={styles.statLabel}>Empty Shelf Alerts</div>
                    </div>
                </div>

                <div
                    className={`${styles.statCard} ${styles.highPriority}`}
                    onClick={() => onNavigate('alerts')}
                >
                    <div className={styles.statIcon}>⚠️</div>
                    <div className={styles.statContent}>
                        <div className={styles.statValue}>{stats.highPriorityAlerts}</div>
                        <div className={styles.statLabel}>High Priority</div>
                    </div>
                </div>

                <div
                    className={`${styles.statCard} ${styles.staff}`}
                    onClick={() => onNavigate('employees')}
                >
                    <div className={styles.statIcon}>👥</div>
                    <div className={styles.statContent}>
                        <div className={styles.statValue}>{stats.availableEmployees}</div>
                        <div className={styles.statLabel}>Available Staff</div>
                    </div>
                </div>

                <div
                    className={`${styles.statCard} ${styles.products}`}
                    onClick={() => onNavigate('products')}
                >
                    <div className={styles.statIcon}>📈</div>
                    <div className={styles.statContent}>
                        <div className={styles.statValue}>{stats.criticalProducts}</div>
                        <div className={styles.statLabel}>Popular Products</div>
                    </div>
                </div>
            </div>

            <div className={styles.quickActions}>
                <h2>Quick Actions</h2>

                <button
                    className={`${styles.actionButton} ${styles.primary}`}
                    onClick={() => onNavigate('alerts')}
                >
                    <span className={styles.actionIcon}>🔔</span>
                    <span className={styles.actionLabel}>View All Alerts</span>
                </button>

                <button
                    className={`${styles.actionButton} ${styles.secondary}`}
                    onClick={() => onNavigate('products')}
                >
                    <span className={styles.actionIcon}>📊</span>
                    <span className={styles.actionLabel}>Product Analytics</span>
                </button>

                <button
                    className={`${styles.actionButton} ${styles.success}`}
                    onClick={() => onNavigate('employees')}
                >
                    <span className={styles.actionIcon}>👤</span>
                    <span className={styles.actionLabel}>Manage Employees</span>
                </button>
            </div>

            {stats.highPriorityAlerts > 0 && (
                <div className={styles.urgentBanner}>
                    <span className={styles.urgentIcon}>⚠️</span>
                    <span className={styles.urgentText}>
                        {stats.highPriorityAlerts} High Priority Alert{stats.highPriorityAlerts > 1 ? 's' : ''} Need Immediate Attention!
                    </span>
                </div>
            )}
        </div>
    );
}
