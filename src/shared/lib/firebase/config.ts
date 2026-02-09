// shared/lib/firebase/config.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;

const getFirebaseApp = (): FirebaseApp => {
    if (typeof window === 'undefined') {
        throw new Error('Firebase는 클라이언트에서만 사용 가능합니다');
    }

    if (!app) {
        if (!getApps().length) {
            app = initializeApp(firebaseConfig);
        } else {
            app = getApps()[0];
        }
    }
    return app;
};

export const auth: Auth = new Proxy({} as Auth, {
    get(_, prop) {
        if (!authInstance) {
            authInstance = getAuth(getFirebaseApp());
        }
        return (authInstance as unknown as Record<string | symbol, unknown>)[
            prop
        ];
    },
});

export const db: Firestore = new Proxy({} as Firestore, {
    get(_, prop) {
        if (!dbInstance) {
            dbInstance = getFirestore(getFirebaseApp());
        }
        return (dbInstance as unknown as Record<string | symbol, unknown>)[
            prop
        ];
    },
});
