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
              {/* Left Column - Contact */}
              <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-6 md:p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">Contact</h2>
                <p className="text-neutral-400 mb-6">
                  Having issues? Need support? Reach out through any of these channels:
                </p>

                <div className="space-y-4">
                  <div className="bg-neutral-800/50 rounded-lg p-4">
                    <p className="text-sm text-neutral-400 mb-2">Discord</p>
                    <p className="text-gray-100 font-medium">
                      DM <span className="text-cyan-400">@romanslack</span> on the AI Club Discord
                    </p>
                  </div>

                  <div className="bg-neutral-800/50 rounded-lg p-4">
                    <p className="text-sm text-neutral-400 mb-2">Email</p>
                    <a
                      href="mailto:romanslack1@gmail.com"
                      className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-medium"
                    >
                      romanslack1@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column - Feedback & Bug Reports */}
              <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-6 md:p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">Feedback & Bug Reports</h2>
                <p className="text-neutral-400 mb-6">
                  Help us improve! Report bugs or share feedback to make the platform better for everyone.
                </p>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">How to Report</h3>

                  <ol className="space-y-3 text-neutral-300">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                        1
                      </span>
                      <span>Join the <span className="text-cyan-400 font-medium">AI Club Discord</span> server</span>
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
                      <span>Post your feedback or bug report with details</span>
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
