type UserRole = 'admin' | 'user';

export interface User {
    _id: string;
    email: string;
    role: UserRole;
}
