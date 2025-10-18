import { Suspense } from 'react';
import AuthCallbackContent from './AuthCallbackContent';

export default function AuthCallback() {
  return (
    <Suspense fallback={<AuthCallbackLoading />}>
      <AuthCallbackContent />
    </Suspense>
  );
}

function AuthCallbackLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neutral-400 mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Loading...</h2>
        <p className="text-neutral-400">Please wait</p>
      </div>
    </div>
  );
}
