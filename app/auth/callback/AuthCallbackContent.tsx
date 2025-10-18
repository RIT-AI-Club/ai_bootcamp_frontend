'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/auth';

export default function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Handle OAuth callback
    const handleCallback = async () => {
      try {
        // Extract tokens from URL parameters
        const tokens = authService.handleOAuthCallback(searchParams);

        if (tokens) {
          // Successfully authenticated - redirect to dashboard
          router.push('/dashboard');
        } else {
          // No tokens found - show error
          setError('Authentication failed. No tokens received.');
          setTimeout(() => {
            router.push('/landing');
          }, 3000);
        }
      } catch (err: any) {
        console.error('OAuth callback error:', err);
        setError(err.message || 'Authentication failed');
        setTimeout(() => {
          router.push('/landing');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-700/50 text-red-400 px-8 py-6 rounded-lg text-center max-w-md">
          <svg
            className="w-16 h-16 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-bold mb-2">Authentication Failed</h2>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-4 text-red-300">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neutral-400 mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Authenticating...</h2>
        <p className="text-neutral-400">Please wait while we log you in</p>
      </div>
    </div>
  );
}
