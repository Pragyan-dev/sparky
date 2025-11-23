'use client';

import { useState, useEffect } from 'react';
import { getEmptyShelfAlerts, getEmployees, dispatchEmployee, resolveAlert } from '../services/dataService';
import styles from './EmptyShelfAlerts.module.css';

export default function EmptyShelfAlerts({ onBack, refreshTrigger }) {
    const [alerts, setAlerts] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadData();
    }, [refreshTrigger]);

    const loadData = () => {
        setAlerts(getEmptyShelfAlerts());
        setEmployees(getEmployees());
    };

    const handleDispatch = (alert) => {
        setSelectedAlert(alert);
        setShowModal(true);
    };

    const confirmDispatch = (employeeId) => {
        const result = dispatchEmployee(selectedAlert.id, employeeId);
        if (result.success) {
            alert(`✅ ${result.employee.name} has been dispatched to ${selectedAlert.aisle}`);
            loadData();
        }
        setShowModal(false);
        setSelectedAlert(null);
    };

    const handleResolve = (alertId) => {
        if (confirm('Has this shelf been restocked?')) {
            resolveAlert(alertId);
            loadData();
        }
    };

    const getPriorityColor = (priority) => {
        if (priority === 'high') return '#EF4444';
        if (priority === 'medium') return '#F59E0B';
        return '#10B981';
    };

    const formatTime = (timestamp) => {
        const now = new Date();
        const diff = Math.floor((now - timestamp) / 60000);
        if (diff < 1) return 'Just now';
        if (diff < 60) return `${diff}m ago`;
        const hours = Math.floor(diff / 60);
        return `${hours}h ago`;
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={onBack} className={styles.backButton}>← Back</button>
                <h1>Empty Shelf Alerts</h1>
                <div className={styles.badge}>{alerts.length}</div>
            </header>

            <div className={styles.content}>
                {alerts.length === 0 ? (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>✅</div>
                        <h2>No Empty Shelf Alerts!</h2>
                        <p>All shelves are fully stocked</p>
                    </div>
                ) : (
                    alerts.map(alert => (
                        <div key={alert.id} className={styles.alertCard} style={{ borderLeftColor: getPriorityColor(alert.priority) }}>
                            <div className={styles.alertHeader}>
                                <div className={styles.priorityBadge} style={{ backgroundColor: getPriorityColor(alert.priority) }}>
                                    {alert.priority.toUpperCase()}
                                </div>
                                <span className={styles.time}>{formatTime(alert.timestamp)}</span>
                            </div>

                            <div className={styles.alertBody}>
                                <h3>{alert.aisle} - {alert.section}</h3>
                                <p className={styles.product}>{alert.product}</p>
                                <p className={styles.reporter}>Reported by: {alert.reportedBy}</p>

                                {alert.assignedTo && (
                                    <div className={styles.assigned}>
                                        👤 Assigned to {alert.assignedTo}
                                    </div>
                                )}
                            </div>

                            <div className={styles.actions}>
                                {alert.status === 'pending' ? (
                                    <button onClick={() => handleDispatch(alert)} className={styles.dispatchBtn}>
                                        🚀 Dispatch Employee
                                    </button>
                                ) : (
                                    <button onClick={() => handleResolve(alert.id)} className={styles.resolveBtn}>
                                        ✓ Mark Resolved
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && selectedAlert && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2>Select Employee</h2>
                        <p>Dispatching to: {selectedAlert.aisle}</p>

                        <div className={styles.employeeList}>
                            {employees.filter(e => e.status === 'available').map(emp => (
                                <div key={emp.id} className={styles.employeeItem} onClick={() => confirmDispatch(emp.id)}>
                                    <span>👤</span>
                                    <span>{emp.name}</span>
                                    <span>→</span>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => setShowModal(false)} className={styles.cancelBtn}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
