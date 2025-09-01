'use client';

import { useState } from 'react';
import SignInModal from '@/components/SignInModal';
import SignUpModal from '@/components/SignUpModal';

export default function LandingPage() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

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
          <h1 className="text-[clamp(2.5rem,12vw,10rem)] md:text-[clamp(3rem,15vw,12rem)] font-black tracking-wider text-gray-100/95 select-none text-center">
            AI BOOTCAMP
          </h1>
          <button 
            onClick={() => setShowSignIn(true)}
            className="mt-8 md:mt-12 text-gray-100/90 hover:text-gray-100/60 transition-colors duration-200 cursor-pointer text-lg md:text-xl lg:text-2xl font-semibold tracking-widest"
          >
            BEGIN
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
    </>
  );
}