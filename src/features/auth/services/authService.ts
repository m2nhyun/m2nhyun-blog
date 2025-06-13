// features/auth/services/authService.ts
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
} from 'firebase/auth';
import { auth } from '@/shared/lib/firebase/config';
import { isAdmin } from '@/shared/lib';

export interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    isAdmin: boolean;
}

// 로그인
export const loginWithEmail = async (
    email: string,
    password: string,
): Promise<AuthUser> => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password,
        );
        const user = userCredential.user;

        const authUser: AuthUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            isAdmin: isAdmin(user.uid),
        };

        // 관리자가 아닌 경우 로그아웃
        if (!authUser.isAdmin) {
            await signOut(auth);
            throw new Error('관리자 권한이 필요합니다');
        }

        return authUser;
    } catch (error) {
        console.error('Login error:', error);
        throw new Error('로그인 중 오류가 발생했습니다');
    }
};

// 로그아웃
export const logout = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Logout error:', error);
        throw new Error('로그아웃 중 오류가 발생했습니다');
    }
};

// 현재 사용자 상태 확인
export const getCurrentUser = (): Promise<AuthUser | null> => {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
            unsubscribe();

            if (user && isAdmin(user.uid)) {
                resolve({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    isAdmin: true,
                });
            } else {
                resolve(null);
            }
        });
    });
};

// 인증 상태 변화 감지
export const onAuthStateChange = (
    callback: (user: AuthUser | null) => void,
) => {
    return onAuthStateChanged(auth, (user: User | null) => {
        if (user && isAdmin(user.uid)) {
            callback({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                isAdmin: true,
            });
        } else {
            callback(null);
        }
    });
};
