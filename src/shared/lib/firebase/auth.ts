// src/shared/lib/firebase/auth.ts
export function isAdmin(uid: string) {
    return uid === process.env.NEXT_PUBLIC_FIREBASE_ADMIN_UID;
}
