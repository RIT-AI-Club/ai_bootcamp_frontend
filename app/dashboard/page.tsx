'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, User } from '@/lib/auth';
import PathwayGrid from '@/components/PathwayGrid';
import AchievementIcon from '@/components/AchievementIcon';
import AchievementsModal from '@/components/AchievementsModal';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPremiumLoading, setShowPremiumLoading] = useState(false);
  const [premiumMessage, setPremiumMessage] = useState("Getting everything ready...");
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if we should show premium loading
      const showPremium = localStorage.getItem('show_premium_loading');
      const isNewUser = localStorage.getItem('is_new_user');
      
      if (showPremium === 'true') {
        setShowPremiumLoading(true);
        setPremiumMessage(isNewUser === 'true' ? 'Setting up your personalized workspace...' : 'Welcome back! Preparing your dashboard...');
        localStorage.removeItem('show_premium_loading');
        localStorage.removeItem('is_new_user');
        
        // Start premium loading experience
        startPremiumLoading();
        return;
      }

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

  const startPremiumLoading = async () => {
    const messages = [
      'Analyzing your learning preferences...',
      'Customizing pathway recommendations...',
      'Loading your progress data...',
      'Finalizing your dashboard...',
      'Almost ready!'
    ];

    // Show different messages during loading
    for (let i = 0; i < messages.length; i++) {
      setTimeout(() => {
        setPremiumMessage(messages[i]);
      }, i * 800);
    }

    // Complete the premium loading after 4-5 seconds
    setTimeout(async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          router.push('/landing');
          return;
        }
        setUser(currentUser);
        setPremiumMessage('Welcome to AI Bootcamp!');
        
        // Small delay to show welcome message
        setTimeout(() => {
          setShowPremiumLoading(false);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/landing');
      }
    }, 4500); // 4.5 seconds total
  };

  const handleLogout = async () => {
    await authService.logout();
    router.push('/landing');
  };

  if (loading || showPremiumLoading) {
    // Use the premium message if available, otherwise default loading message
    const displayMessage = showPremiumLoading ? premiumMessage : "Initializing your learning experience...";
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-black via-neutral-900 to-neutral-800 flex items-center justify-center overflow-hidden">
        <div className="relative flex flex-col items-center">
          {/* Circle animation container - perfectly centered */}
          <div className="relative w-48 h-48 mb-8">
            {/* Outer rotating rings - Slowed down */}
            <div className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-16 -translate-y-16">
              <div className="w-full h-full border-2 border-transparent border-t-blue-500 border-r-cyan-500 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
            </div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 -translate-x-12 -translate-y-12">
              <div className="w-full h-full border-2 border-transparent border-t-purple-500 border-l-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '4s' }}></div>
            </div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-8 -translate-y-8">
              <div className="w-full h-full border-2 border-transparent border-t-emerald-500 border-b-teal-500 rounded-full animate-spin" style={{ animationDuration: '5s' }}></div>
            </div>
            
            {/* Central pulsing orb */}
            <div className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-4 -translate-y-4">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 rounded-full animate-pulse"></div>
              <div className="absolute inset-1 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
            
            {/* Expanding wave rings */}
            <div className="absolute top-1/2 left-1/2 w-40 h-40 -translate-x-20 -translate-y-20">
              <div className="w-full h-full border border-white/10 rounded-full animate-ping"></div>
            </div>
            <div className="absolute top-1/2 left-1/2 w-48 h-48 -translate-x-24 -translate-y-24">
              <div className="w-full h-full border border-white/5 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
          
          {/* Loading text - perfectly centered below circles */}
          <div className="text-center">
            {/* Bouncing dots above text */}
            <div className="flex items-center justify-center space-x-1 mb-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            </div>
            
            <div className="text-gray-100/90 text-xl font-bold tracking-wider mb-4">
              AI BOOTCAMP
            </div>
            <div className="text-neutral-300 text-sm animate-pulse max-w-xs">
              {displayMessage}
            </div>
          </div>
        </div>
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
            
            {/* Achievement Icon - positioned under email */}
            <div className="mt-3">
              <AchievementIcon onClick={() => setShowAchievementsModal(true)} />
            </div>
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

      {/* Achievements Modal */}
      <AchievementsModal 
        isOpen={showAchievementsModal} 
        onClose={() => setShowAchievementsModal(false)} 
      />
    </div>
  );
}