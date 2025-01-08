// src/lib/firebase/auth.ts
// import { auth } from './config';

export function isAdmin(uid: string) {
    return uid === process.env.NEXT_PUBLIC_FIREBASE_ADMIN_UID;
}
