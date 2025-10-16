'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = 'info',
  isVisible,
  onClose,
  duration = 3000
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-900/95',
          border: 'border-emerald-600/50',
          icon: '✓',
          iconColor: 'text-emerald-400'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-900/95',
          border: 'border-yellow-600/50',
          icon: '⚠',
          iconColor: 'text-yellow-400'
        };
      case 'error':
        return {
          bg: 'bg-red-900/95',
          border: 'border-red-600/50',
          icon: '✕',
          iconColor: 'text-red-400'
        };
      default:
        return {
          bg: 'bg-neutral-900/95',
          border: 'border-neutral-600/50',
          icon: 'ℹ',
          iconColor: 'text-blue-400'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999]"
        >
          <div className={`${styles.bg} backdrop-blur-sm border ${styles.border} rounded-xl px-4 py-3 shadow-2xl min-w-[300px] max-w-md`}>
            <div className="flex items-center space-x-3">
              {/* Icon */}
              <div className={`w-6 h-6 rounded-full bg-black/30 flex items-center justify-center ${styles.iconColor} font-bold text-sm`}>
                {styles.icon}
              </div>

              {/* Message */}
              <span className="text-gray-100 text-sm font-medium flex-1">
                {message}
              </span>

              {/* Close button */}
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
