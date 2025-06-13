// utils/firebase/auth.ts
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export async function checkAdminRole(_id: string) {
    try {
        const userDoc = await getDoc(doc(db, 'users', _id));
        if (!userDoc.exists()) return false;
        return userDoc.data()?.role === 'admin';
    } catch (error) {
        console.error('Error checking admin role:', error);
        return false;
    }
}
