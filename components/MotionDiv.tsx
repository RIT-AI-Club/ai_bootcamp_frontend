'use client';

import { motion, MotionProps } from 'framer-motion';
import { forwardRef } from 'react';
import { useHydration } from '@/lib/hooks/useHydration';

interface MotionDivProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Hydration-safe motion div that only animates after client-side hydration
 * Prevents hydration mismatches by disabling animations during SSR
 */
const MotionDiv = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, initial, animate, transition, className, ...props }, ref) => {
    const isHydrated = useHydration();

    // Disable animations during SSR to prevent hydration mismatches
    const motionProps = isHydrated
      ? { initial, animate, transition, ...props }
      : { ...props };

    return (
      <motion.div
        ref={ref}
        className={className}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }
);

MotionDiv.displayName = 'MotionDiv';

export default MotionDiv;