'use client';

import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Dashboard } from '@/components/game/Dashboard';
import { ThemeProvider } from "@/components/theme-provider";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background/80 to-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-lg text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const backgroundClasses = `
    min-h-screen 
    bg-gradient-to-b from-background/80 to-background/95
    dark:from-background dark:to-background/90
    text-foreground
    antialiased
    transition-colors duration-300
  `;

  if (!user) {
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <main className={backgroundClasses}>
          <div className="absolute inset-0 bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:opacity-20" />
          <div className="relative">
            <LoginForm onLogin={login} />
          </div>
        </main>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <main className={backgroundClasses}>
        <div className="absolute inset-0 bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:opacity-20" />
        <div className="relative">
          <Dashboard user={user} onLogout={logout} />
        </div>
      </main>
    </ThemeProvider>
  );
}