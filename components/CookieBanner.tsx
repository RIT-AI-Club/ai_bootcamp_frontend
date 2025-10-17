'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Cookie Consent Banner Component
 * Displays on first visit and stores consent in localStorage
 * Follows existing patterns from BetaBadge.tsx and Toast.tsx
 */
export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const STORAGE_KEY = 'cookie_consent_accepted';

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if user has already accepted cookies
  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;

    try {
      const consentAccepted = localStorage.getItem(STORAGE_KEY);
      if (!consentAccepted) {
        // Show banner after short delay for better UX
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Failed to check cookie consent:', error);
    }
  }, [isClient]);

  const handleAccept = () => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsVisible(false);
    } catch (error) {
      console.error('Failed to save cookie consent:', error);
    }
  };

  const handleDismiss = () => {
    if (typeof window === 'undefined') return;

    try {
      // Store dismissal as well (same as acceptance for simplicity)
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsVisible(false);
    } catch (error) {
      console.error('Failed to save cookie consent:', error);
    }
  };

  // Don't render anything during SSR or if not visible
  if (!isClient || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[100]"
        >
          <div className="bg-gradient-to-br from-neutral-900 via-neutral-900/95 to-neutral-800 backdrop-blur-sm border border-neutral-700/50 rounded-2xl shadow-2xl p-4 md:p-5">
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1 text-neutral-400 hover:text-neutral-200 transition-colors"
              aria-label="Close cookie banner"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="pr-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🍪</span>
                <h3 className="text-lg font-bold text-gray-100">Cookie Notice</h3>
              </div>

              <p className="text-neutral-300 text-sm leading-relaxed mb-4">
                We use localStorage to save your authentication tokens and quiz progress locally.
                This ensures a seamless experience across sessions. No data is shared with third parties.
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleAccept}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-700 hover:to-blue-700 transition-all text-sm shadow-lg"
                >
                  Accept
                </button>
                <button
                  onClick={handleDismiss}
                  className="flex-1 px-4 py-2 bg-neutral-700/50 text-neutral-300 rounded-lg font-medium hover:bg-neutral-700/70 transition-colors text-sm"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
