import { useEffect, useState } from 'react';

/**
 * Custom hook to safely handle client-side only operations after hydration
 * Prevents hydration mismatches by ensuring consistent server/client rendering
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * Hook for client-side only rendering
 * Returns null during SSR to prevent hydration mismatches
 */
export function useClientOnly() {
  const isHydrated = useHydration();
  return isHydrated;
}