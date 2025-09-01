'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PremiumLoaderProps {
  message?: string;
  onComplete?: () => void;
  duration?: number; // in milliseconds
}

export default function PremiumLoader({ 
  message = "Getting everything ready...", 
  onComplete,
  duration = 4000 // 4 seconds default
}: PremiumLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(message);
  
  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        // Non-linear progress for more premium feel
        const increment = Math.random() * 8 + 2; // 2-10% increments
        return Math.min(prev + increment, 100);
      });
    }, duration / 20); // Update 20 times during duration

    // Message variations for premium feel
    const messages = [
      "Getting everything ready...",
      "Setting up your workspace...",
      "Personalizing your experience...",
      "Almost there..."
    ];
    
    const messageInterval = setInterval(() => {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setCurrentMessage(randomMessage);
    }, duration / 4); // Change message 4 times

    // Complete after duration
    const completeTimer = setTimeout(() => {
      setProgress(100);
      setCurrentMessage("Welcome!");
      setTimeout(() => {
        onComplete?.();
      }, 800); // Small delay after "Welcome!"
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-neutral-900 to-neutral-800 flex items-center justify-center overflow-hidden">
      <div className="relative">
        {/* Outer rotating rings */}
        <div className="absolute inset-0 w-32 h-32 -translate-x-16 -translate-y-16">
          <div className="w-full h-full border-2 border-transparent border-t-blue-500 border-r-cyan-500 rounded-full animate-spin"></div>
        </div>
        <div className="absolute inset-0 w-24 h-24 -translate-x-12 -translate-y-12">
          <div className="w-full h-full border-2 border-transparent border-t-purple-500 border-l-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <div className="absolute inset-0 w-16 h-16 -translate-x-8 -translate-y-8">
          <div className="w-full h-full border-2 border-transparent border-t-emerald-500 border-b-teal-500 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
        </div>
        
        {/* Central pulsing orb */}
        <div className="relative w-8 h-8 -translate-x-4 -translate-y-4">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 rounded-full animate-pulse"></div>
          <div className="absolute inset-1 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
        
        {/* Orbiting dots */}
        <div className="absolute inset-0 w-20 h-20 -translate-x-10 -translate-y-10 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-yellow-400 rounded-full -translate-x-1 animate-pulse"></div>
          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-rose-400 rounded-full -translate-x-1 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute left-0 top-1/2 w-2 h-2 bg-violet-400 rounded-full -translate-y-1 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute right-0 top-1/2 w-2 h-2 bg-amber-400 rounded-full -translate-y-1 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        {/* Expanding wave rings */}
        <div className="absolute inset-0 w-40 h-40 -translate-x-20 -translate-y-20">
          <div className="w-full h-full border border-white/10 rounded-full animate-ping"></div>
        </div>
        <div className="absolute inset-0 w-48 h-48 -translate-x-24 -translate-y-24">
          <div className="w-full h-full border border-white/5 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        </div>
        
        {/* Loading content */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center w-64">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-100/90 text-xl font-bold tracking-wider mb-3"
          >
            AI BOOTCAMP
          </motion.div>
          
          {/* Progress bar */}
          <div className="w-full bg-neutral-700/30 rounded-full h-1.5 mb-4 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          
          {/* Dynamic message */}
          <motion.div
            key={currentMessage}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-neutral-300 text-sm mb-2"
          >
            {currentMessage}
          </motion.div>
          
          {/* Progress percentage */}
          <div className="text-neutral-500 text-xs">
            {Math.round(progress)}%
          </div>
          
          {/* Bouncing dots */}
          <div className="flex items-center justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}