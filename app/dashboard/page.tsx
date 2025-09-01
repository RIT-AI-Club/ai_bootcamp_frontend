'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, User } from '@/lib/auth';
import PathwayGrid from '@/components/PathwayGrid';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        router.push('/landing');
        return;
      }
      setUser(currentUser);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/landing');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    router.push('/landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-black via-neutral-900 to-neutral-800 flex items-center justify-center">
        <div className="text-gray-100/95 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-neutral-800/20 to-neutral-600/10" />
      </div>
      
      <div className="relative z-10 min-h-screen">
        <div className="flex justify-between items-center p-6 md:p-8">
          <div className="text-gray-100/95">
            <h2 className="text-2xl font-bold">Welcome, {user?.full_name}</h2>
            <p className="text-sm text-neutral-400 mt-1">{user?.email}</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="text-gray-100/90 hover:text-gray-100/60 transition-colors duration-200 font-semibold tracking-wider"
          >
            LOGOUT
          </button>
        </div>
        
        <div className="py-8">
          <PathwayGrid />
        </div>
      </div>
    </div>
  );
}