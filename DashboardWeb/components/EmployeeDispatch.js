'use client';

import { useState, useEffect } from 'react';
import { getEmployees } from '../services/dataService';
import styles from './EmployeeDispatch.module.css';

export default function EmployeeDispatch({ onBack, refreshTrigger }) {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        setEmployees(getEmployees());
    }, [refreshTrigger]);

    const available = employees.filter(e => e.status === 'available');
    const busy = employees.filter(e => e.status === 'busy');

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={onBack} className={styles.backButton}>← Back</button>
                <h1>Employee Management</h1>
            </header>

            <div className={styles.stats}>
                <div className={styles.stat}>
                    <div className={styles.statValue}>{employees.length}</div>
                    <div className={styles.statLabel}>Total Staff</div>
                </div>
                <div className={styles.stat}>
                    <div className={styles.statValue} style={{ color: 'var(--success)' }}>{available.length}</div>
                    <div className={styles.statLabel}>Available</div>
                </div>
                <div className={styles.stat}>
                    <div className={styles.statValue} style={{ color: 'var(--warning)' }}>{busy.length}</div>
                    <div className={styles.statLabel}>On Task</div>
                </div>
            </div>

            <div className={styles.content}>
                <h2>Available Staff</h2>
                {available.length === 0 ? (
                    <p className={styles.empty}>No available staff at the moment</p>
                ) : (
                    available.map(emp => (
                        <div key={emp.id} className={styles.employeeCard}>
                            <span className={styles.avatar}>👤</span>
                            <div className={styles.info}>
                                <div className={styles.name}>{emp.name}</div>
                                <div className={styles.statusBadge} style={{ background: 'var(--success)' }}>
                                    ✓ Available
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {busy.length > 0 && (
                    <>
                        <h2 style={{ marginTop: '32px' }}>Staff On Task</h2>
                        {busy.map(emp => (
                            <div key={emp.id} className={styles.employeeCard}>
                                <span className={styles.avatar}>👤</span>
                                <div className={styles.info}>
                                    <div className={styles.name}>{emp.name}</div>
                                    <div className={styles.statusBadge} style={{ background: 'var(--warning)' }}>
                                        ⏱ Busy
                                    </div>
                                    {emp.assignedTo && (
                                        <div className={styles.assignment}>📍 {emp.assignedTo}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </>
                )}

                <div className={styles.helpBox}>
                    <span>ℹ️</span>
                    <div>
                        <strong>How to Dispatch</strong>
                        <p>Go to "Empty Shelf Alerts" and tap "Dispatch Employee" on any alert to assign available staff.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
