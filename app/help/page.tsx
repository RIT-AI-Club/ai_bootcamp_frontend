'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import OnboardingModal from '@/components/OnboardingModal';
import { authService } from '@/lib/auth';

export default function HelpPage() {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);

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
          <div className="max-w-5xl w-full">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4 text-center">
              Need Help?
            </h1>

            {/* Beta Notice */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-8 max-w-3xl mx-auto">
              <p className="text-yellow-200/90 text-sm md:text-base font-medium text-center">
                This platform is currently in beta. Issues may occur, and we appreciate your patience!
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column - Direct Contact */}
              <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-6 md:p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">Direct Questions for Roman</h2>
                <p className="text-neutral-400 mb-6">
                  Have specific questions? Reach out directly:
                </p>

                <div className="space-y-4">
                  <div className="bg-neutral-800/50 rounded-lg p-4">
                    <p className="text-sm text-neutral-400 mb-2">Email</p>
                    <a
                      href="mailto:romanslack1@gmail.com"
                      className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-medium"
                    >
                      romanslack1@gmail.com
                    </a>
                  </div>

                  <div className="bg-neutral-800/50 rounded-lg p-4">
                    <p className="text-sm text-neutral-400 mb-2">Discord</p>
                    <p className="text-gray-100 font-medium">
                      DM <span className="text-cyan-400">@romanslack</span> on the AI Club Discord
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Help, Bugs, Feedback */}
              <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-6 md:p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">Need Help, Bug Reports, or Feedback?</h2>
                <p className="text-neutral-400 mb-6">
                  All support requests, bug reports, and feedback should go to the Discord channel.
                </p>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Where to Post</h3>

                  <ol className="space-y-3 text-neutral-300">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                        1
                      </span>
                      <span className="flex items-center gap-2 flex-wrap">
                        <span>Join the <span className="text-cyan-400 font-medium">AI Club Discord</span> server</span>
                        <a
                          href="https://discord.gg/caUmHXxyZy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold transition-colors"
                          title="Join Discord Server"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                          </svg>
                          Join
                        </a>
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                        2
                      </span>
                      <span>Navigate to the <span className="text-cyan-400 font-medium">#ai-bootcamp</span> channel</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                        3
                      </span>
                      <span>Post your issue, feedback, or mention <span className="text-cyan-400 font-medium">@romanslack</span> if you need help</span>
                    </li>
                  </ol>
                </div>

                <div className="bg-neutral-800/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-100 mb-2">What to Include:</h4>
                  <ul className="space-y-1 text-sm text-neutral-400">
                    <li>• What you were trying to do</li>
                    <li>• What went wrong or what could be better</li>
                    <li>• Screenshots (if applicable)</li>
                    <li>• Your browser and device info</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Onboarding Section */}
            <div className="mt-8 bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6 md:p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-100 mb-3">New to the Platform?</h2>
              <p className="text-neutral-300 mb-4">
                Watch our onboarding tutorial to learn how to navigate the platform and get the most out of your learning experience.
              </p>
              <button
                onClick={() => setShowOnboarding(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold tracking-wide rounded-lg transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
              >
                VIEW ONBOARDING TUTORIAL
              </button>
            </div>

            {/* Thank You Message */}
            <div className="mt-8 text-center">
              <p className="text-neutral-400 italic">
                Thank you for your patience as we continue to improve the platform!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
        onSkip={() => setShowOnboarding(false)}
      />
    </div>
  );
}
