import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: 'demo-api-key',
    authDomain: 'sparky-shopper-demo.firebaseapp.com',
    projectId: 'sparky-shopper-demo',
    storageBucket: 'sparky-shopper-demo.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:abcdef123456',
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Connect to emulators in development
const USE_EMULATORS = __DEV__;

if (USE_EMULATORS) {
    try {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
        connectFirestoreEmulator(db, '127.0.0.1', 8080);
        connectFunctionsEmulator(functions, '127.0.0.1', 5001);
        console.log('✅ Connected to Firebase Emulators');
    } catch (error) {
        console.warn('⚠️ Emulator connection failed:', error);
    }
}

export default app;
