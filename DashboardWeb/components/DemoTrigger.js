'use client';

import { useState } from 'react';
import { addEmptyShelfAlert } from '../services/dataService';
import styles from './DemoTrigger.module.css';

export default function DemoTrigger({ onRefresh, onNavigate }) {
    const [showModal, setShowModal] = useState(false);
    const [aisle, setAisle] = useState('');
    const [product, setProduct] = useState('');

    const handleTrigger = () => {
        if (!aisle.trim() || !product.trim()) {
            alert('Please enter both aisle and product name');
            return;
        }

        const newAlert = addEmptyShelfAlert({
            aisle: aisle.trim(),
            product: product.trim(),
            section: 'Demo Section',
            priority: 'high',
            reportedBy: 'Customer via App (DEMO)',
        });

        // Close modal immediately
        setShowModal(false);
        setAisle('');
        setProduct('');

        // Wait 2 seconds, then show confirmation
        setTimeout(() => {
            if (confirm(`🔔 New Empty Shelf Alert!\n\n${newAlert.aisle}: ${newAlert.product}\n\nReported by: ${newAlert.reportedBy}\n\nView alerts now?`)) {
                onRefresh();
                onNavigate('alerts');
            } else {
                onRefresh();
            }
        }, 9000);
    };

    return (
        <>
            <button
                className={styles.demoButton}
                onClick={() => setShowModal(true)}
                title="Trigger Demo Notification"
            >
                <span>➕</span>
                <span>DEMO</span>
            </button>

            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <span className={styles.modalIcon}>📢</span>
                            <h2>Simulate Empty Shelf Alert</h2>
                        </div>

                        <p className={styles.modalSubtitle}>
                            Create a demo notification for your presentation
                        </p>

                        <div className={styles.inputGroup}>
                            <label>Aisle Location</label>
                            <input
                                type="text"
                                placeholder="e.g., Aisle 5"
                                value={aisle}
                                onChange={(e) => setAisle(e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Product Name</label>
                            <input
                                type="text"
                                placeholder="e.g., Cereal Boxes"
                                value={product}
                                onChange={(e) => setProduct(e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => {
                                    setShowModal(false);
                                    setAisle('');
                                    setProduct('');
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                className={styles.triggerButton}
                                onClick={handleTrigger}
                            >
                                <span>🔔</span>
                                Trigger Alert
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
