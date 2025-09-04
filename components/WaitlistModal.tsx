'use client';

import { useEffect, useRef } from 'react';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSePYEBA4AD8bmagyqPjTVFHBHeJhbtS630vAikaO2SVsN2QCg/viewform?embedded=true';

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Modal */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-4xl bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-slideUp"
        style={{
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50 bg-black/20">
          <h2 className="text-xl md:text-2xl font-bold text-gray-100 tracking-wide">
            JOIN THE WAITLIST
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-white/10"
            aria-label="Close modal"
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
              title="Waitlist Form"
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
      </div>
    </div>
  );
}