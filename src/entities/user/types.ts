export interface User {
    id: string;
    email: string;
    name: string;
    displayName?: string;
    avatar?: string;
    bio?: string;
    role: 'admin' | 'user';
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
}

export interface UserCreateData {
    email: string;
    name: string;
    displayName?: string;
    avatar?: string;
    bio?: string;
    role?: 'admin' | 'user';
}

export interface UserUpdateData extends Partial<UserCreateData> {
    id: string;
}
