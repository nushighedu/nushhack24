'use client';

import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Dashboard } from '@/components/game/Dashboard';

export default function Home() {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
        <LoginForm onLogin={login} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <Dashboard user={user} onLogout={logout} />
    </main>
  );
}