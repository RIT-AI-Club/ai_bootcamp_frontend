'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SignInModal from '@/components/SignInModal';
import SignUpModal from '@/components/SignUpModal';
import WaitlistModal from '@/components/WaitlistModal';
import BetaBadge from '@/components/BetaBadge';
import { authService } from '@/lib/auth';

export default function LandingPage() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [isHoveringBegin, setIsHoveringBegin] = useState(false);
  const [isHoveringWaitlist, setIsHoveringWaitlist] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        router.push('/dashboard');
      }
    } catch (error) {
      // User not authenticated, stay on landing page
    }
  };

  const handleSwitchToSignUp = () => {
    setShowSignIn(false);
    setShowSignUp(true);
  };

  const handleSwitchToSignIn = () => {
    setShowSignUp(false);
    setShowSignIn(true);
  };

  return (
    <>
      <div className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-neutral-800">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-neutral-800/20 to-neutral-600/10" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <h1 
            className={`text-[clamp(2.5rem,12vw,10rem)] md:text-[clamp(3rem,15vw,12rem)] font-black tracking-wider select-none text-center transition-all duration-700 ease-in-out ${
              isHoveringBegin || isHoveringWaitlist
                ? 'bg-gradient-to-r from-blue-500 via-purple-500 via-green-500 via-yellow-500 via-rose-500 via-indigo-500 via-teal-500 via-violet-500 via-amber-500 via-sky-500 via-emerald-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent animate-gradient-x' 
                : 'text-gray-100/95'
            }`}
            style={{
              backgroundSize: isHoveringBegin || isHoveringWaitlist ? '400% 100%' : '100% 100%'
            }}
          >
            AI BOOTCAMP
          </h1>
          <button
            onClick={() => setShowSignIn(true)}
            onMouseEnter={() => setIsHoveringBegin(true)}
            onMouseLeave={() => setIsHoveringBegin(false)}
            className="mt-8 md:mt-12 text-gray-100/90 hover:text-gray-100/60 transition-colors duration-200 cursor-pointer text-lg md:text-xl lg:text-2xl font-semibold tracking-widest"
          >
            BEGIN
          </button>
          <button
            onClick={() => router.push('/about')}
            className="mt-4 md:mt-6 text-gray-100/90 hover:text-gray-100/60 transition-colors duration-200 cursor-pointer text-sm md:text-base font-semibold tracking-widest"
          >
            ABOUT
          </button>
          <button
            onClick={() => setShowWaitlist(true)}
            onMouseEnter={() => setIsHoveringWaitlist(true)}
            onMouseLeave={() => setIsHoveringWaitlist(false)}
            className="mt-4 md:mt-6 text-gray-100/90 hover:text-gray-100/60 transition-colors duration-200 cursor-pointer text-lg md:text-xl lg:text-2xl font-semibold tracking-widest border border-gray-100/30 hover:border-gray-100/20 px-4 py-1 hidden"
          >
            JOIN WAITLIST
          </button>
        </div>
      </div>

      <SignInModal 
        isOpen={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSwitchToSignUp={handleSwitchToSignUp}
      />

      <SignUpModal
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSwitchToSignIn={handleSwitchToSignIn}
      />

      <WaitlistModal
        isOpen={showWaitlist}
        onClose={() => setShowWaitlist(false)}
      />

      {/* Beta Badge */}
      <BetaBadge />
    </>
  );
}