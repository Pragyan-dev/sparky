'use client';

import { useState } from 'react';
import Dashboard from '../components/Dashboard';
import EmptyShelfAlerts from '../components/EmptyShelfAlerts';
import PopularProducts from '../components/PopularProducts';
import EmployeeDispatch from '../components/EmployeeDispatch';
import DemoTrigger from '../components/DemoTrigger';
import '../styles/globals.css';

export default function Home() {
    const [currentScreen, setCurrentScreen] = useState('dashboard');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const renderScreen = () => {
        switch (currentScreen) {
            case 'dashboard':
                return (
                    <Dashboard
                        onNavigate={setCurrentScreen}
                        refreshTrigger={refreshTrigger}
                    />
                );
            case 'alerts':
                return (
                    <EmptyShelfAlerts
                        onBack={() => setCurrentScreen('dashboard')}
                        refreshTrigger={refreshTrigger}
                    />
                );
            case 'products':
                return (
                    <PopularProducts
                        onBack={() => setCurrentScreen('dashboard')}
                    />
                );
            case 'employees':
                return (
                    <EmployeeDispatch
                        onBack={() => setCurrentScreen('dashboard')}
                        refreshTrigger={refreshTrigger}
                    />
                );
            default:
                return (
                    <Dashboard
                        onNavigate={setCurrentScreen}
                        refreshTrigger={refreshTrigger}
                    />
                );
        }
    };

    return (
        <main>
            {renderScreen()}
            <DemoTrigger onRefresh={triggerRefresh} onNavigate={setCurrentScreen} />
        </main>
    );
}
