// shared/lib/firebase/admin.ts
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let app: App | undefined;
let adminDb: Firestore | undefined;
let adminAuth: Auth | undefined;

const getAdminApp = (): App => {
    if (!app) {
        const existingApps = getApps();

        if (existingApps.length > 0) {
            app = existingApps[0];
        } else {
            const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(
                /\\n/g,
                '\n',
            );

            app = initializeApp({
                credential: cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: privateKey,
                }),
            });
        }
    }
    return app;
};

export const getAdminDb = (): Firestore => {
    if (!adminDb) {
        adminDb = getFirestore(getAdminApp());
    }
    return adminDb;
};

export const getAdminAuth = (): Auth => {
    if (!adminAuth) {
        adminAuth = getAuth(getAdminApp());
    }
    return adminAuth;
};
