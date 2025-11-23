'use client';

import { useState, useEffect } from 'react';
import { getPopularProducts } from '../services/dataService';
import styles from './PopularProducts.module.css';

export default function PopularProducts({ onBack }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        setProducts(getPopularProducts());
    }, []);

    const getStatusColor = (status) => {
        if (status === 'critical') return '#EF4444';
        if (status === 'low') return '#F59E0B';
        if (status === 'medium') return '#F59E0B';
        return '#10B981';
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={onBack} className={styles.backButton}>← Back</button>
                <h1>Popular Products</h1>
            </header>

            <div className={styles.content}>
                <div className={styles.infoBox}>
                    <span className={styles.infoIcon}>ℹ️</span>
                    <div>
                        <strong>What is Depletion Rate?</strong>
                        <p>Shows how quickly products are selling. High depletion = high demand.</p>
                    </div>
                </div>

                <h2>All Products</h2>
                {products.map((product, idx) => (
                    <div key={idx} className={styles.productCard}>
                        <div className={styles.productHeader}>
                            <div>
                                <h3>{product.product}</h3>
                                <p className={styles.category}>{product.category}</p>
                            </div>
                            <div className={styles.badge} style={{ backgroundColor: getStatusColor(product.stockStatus) }}>
                                {product.stockStatus.toUpperCase()}
                            </div>
                        </div>

                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{
                                    width: `${product.depletionRate}%`,
                                    backgroundColor: getStatusColor(product.stockStatus)
                                }}
                            />
                        </div>
                        <div className={styles.rate}>{product.depletionRate}% Depletion Rate</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
