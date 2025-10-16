'use client';

export default function BetaBadge() {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-neutral-900/95 backdrop-blur-sm border border-yellow-600/30 rounded-full px-4 py-2 shadow-lg">
        <div className="flex items-center space-x-2">
          {/* Beta icon */}
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <span className="text-black text-xs font-black">β</span>
          </div>

          {/* Text */}
          <div className="flex items-center space-x-1.5">
            <span className="text-yellow-400 text-sm font-semibold">BETA</span>
            <span className="text-neutral-400 text-xs">•</span>
            <span className="text-neutral-400 text-xs">You may experience bugs</span>
          </div>

          {/* Warning icon */}
          <svg className="w-4 h-4 text-yellow-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
