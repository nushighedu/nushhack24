import { useState, useEffect } from 'react';
import { LocalStore } from '@/lib/store';
import type { User } from '@/lib/types';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const lastUsername = localStorage.getItem('lastUsername');
        if (lastUsername) {
            const user = LocalStore.getUser(lastUsername);
            if (user) setUser(user);
        }
        setLoading(false);
    }, []);

    const login = (user: User) => {
        setUser(user);
        localStorage.setItem('lastUsername', user.username);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('lastUsername');
    };

    const updateUser = (updates: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...updates };
        LocalStore.setUser(user.username, updatedUser);
        setUser(updatedUser);
    };

    return { user, loading, login, logout, updateUser };
}