'use client';

import { useEffect, useRef } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Feedback Modal with embedded Google Form
 * z-[9999] to appear above all other modals and UI elements (except Toast)
 * Follows existing patterns from WaitlistModal.tsx
 */
export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // Google Form embed URL
  // Using the provided short URL - browsers will handle the redirect in the iframe
  // If the short URL doesn't work in iframe, user will need to provide the full form ID
  const FORM_URL = 'https://forms.gle/p1YLXL23nDgfXgJn9';

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Do NOT lock background scroll - allow other modals to remain functional
  // This differs from WaitlistModal pattern intentionally

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn"
      onClick={(e) => {
        // Only close if clicking the backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Backdrop - high opacity to distinguish from lower modals */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-4xl bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-slideUp border border-neutral-600/40"
        style={{
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50 bg-black/20">
          <div className="flex items-center gap-3">
            {/* Feedback icon */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
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
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-gray-100 tracking-wide">
              SEND FEEDBACK
            </h2>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-white/10"
            aria-label="Close feedback modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Container */}
        <div className="relative bg-black/10">
          <div
            className="w-full"
            style={{
              aspectRatio: '16 / 9',
              minHeight: '560px',
              maxHeight: 'calc(90vh - 80px)',
            }}
          >
            <iframe
              src={FORM_URL}
              title="Feedback Form"
              loading="lazy"
              className="w-full h-full border-0"
              style={{
                colorScheme: 'light',
              }}
              referrerPolicy="no-referrer-when-downgrade"
              allow="clipboard-write"
            />
          </div>
        </div>

        {/* Subtle hint text */}
        <div className="px-6 py-3 bg-black/20 border-t border-gray-700/50">
          <p className="text-neutral-400 text-xs text-center">
            Your feedback helps us improve AI Bootcamp. Thank you for taking the time!
          </p>
        </div>
      </div>
    </div>
  );
}
