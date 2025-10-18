'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import FeedbackModal from './FeedbackModal';

/**
 * Fixed feedback button in bottom-right corner
 * Visible on all pages except /landing
 * Opens modal with embedded Google Form
 * Follows existing patterns from BetaBadge.tsx and CookieBanner.tsx
 */
export default function FeedbackButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Hide on landing page
  if (!isClient || pathname === '/landing') {
    return null;
  }

  return (
    <>
      {/* Floating Feedback Button - z-[9998] to be below Toast (z-[9999]) but above modals (z-50) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-4 right-4 z-[9998] group"
        aria-label="Open feedback form"
      >
        <div className="relative">
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />

          {/* Main button */}
          <div className="relative flex items-center gap-2 bg-gradient-to-br from-neutral-900 via-neutral-900/95 to-neutral-800 backdrop-blur-sm border border-neutral-700/50 rounded-full px-4 py-3 shadow-2xl hover:border-neutral-600/60 transition-all duration-200 group-hover:scale-105">
            {/* Feedback icon */}
            <svg
              className="w-5 h-5 text-gray-100/90 group-hover:text-blue-400 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>

            {/* Text label */}
            <span className="text-sm font-semibold text-gray-100/90 group-hover:text-blue-400 transition-colors tracking-wide">
              FEEDBACK
            </span>
          </div>
        </div>
      </button>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
