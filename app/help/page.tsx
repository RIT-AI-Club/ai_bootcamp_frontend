'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function HelpPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-neutral-800/20 to-neutral-600/10" />
      </div>

      <div className="relative z-10 min-h-screen">
        <div className="flex justify-between items-center p-6 md:p-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-100/90 hover:text-gray-100/60 transition-colors duration-200 font-semibold tracking-wider"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            BACK
          </button>
        </div>

        <div className="flex items-center justify-center px-6 py-12">
          <div className="max-w-2xl w-full bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-8 md:p-12 shadow-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-8 text-center">
              Need Help?
            </h1>

            <div className="space-y-6 text-neutral-300">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                <p className="text-yellow-200/90 text-sm md:text-base font-medium">
                  This platform is currently in beta. Issues may occur, and we appreciate your patience!
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-100">Having issues?</h2>

                <div className="space-y-3">
                  <p className="text-base md:text-lg">
                    Feel free to reach out through any of these channels:
                  </p>

                  <div className="bg-neutral-800/50 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-sm text-neutral-400 mb-1">Discord</p>
                      <p className="text-gray-100 font-medium">
                        DM <span className="text-cyan-400">@romanslack</span> on the AI Club Discord
                      </p>
                    </div>

                    <div className="border-t border-neutral-700/50 pt-3">
                      <p className="text-sm text-neutral-400 mb-1">Email</p>
                      <a
                        href="mailto:romanslack1@gmail.com"
                        className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-medium"
                      >
                        romanslack1@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 text-center">
                <p className="text-neutral-400 italic">
                  Thank you for your patience as we continue to improve the platform!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
