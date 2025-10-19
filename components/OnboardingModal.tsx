'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const YOUTUBE_VIDEO_ID = 'hx7hScUQDT0'; // AI Bootcamp Introduction Video

export default function OnboardingModal({ isOpen, onComplete, onSkip }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Welcome to AI Bootcamp!',
      content: (
        <div className="space-y-6">
          <p className="text-neutral-300 text-lg leading-relaxed">
            We're thrilled to have you join our community of AI learners. This platform is designed to provide you with
            structured, hands-on learning experiences across various AI domains.
          </p>
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
            <p className="text-cyan-200 text-sm font-medium">
              Complete interactive modules, earn achievements, and track your progress as you master AI tools and techniques.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Quick Introduction',
      content: (
        <div className="space-y-4">
          <p className="text-neutral-300 text-sm mb-4">
            Watch this brief introduction to get started:
          </p>
          <div className="relative w-full bg-neutral-900 rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
              title="AI Bootcamp Introduction"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Need Help?',
      content: (
        <div className="space-y-4">
          <p className="text-neutral-300 leading-relaxed">
            We're here to support you throughout your learning journey.
          </p>
          <div className="grid gap-4">
            <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/50">
              <h4 className="text-gray-100 font-semibold mb-2 flex items-center gap-2">
                <span className="text-cyan-400">📖</span> About Page
              </h4>
              <p className="text-neutral-400 text-sm">
                Learn about the project, team, and technology stack powering this platform.
              </p>
            </div>
            <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/50">
              <h4 className="text-gray-100 font-semibold mb-2 flex items-center gap-2">
                <span className="text-cyan-400">💬</span> Help Page
              </h4>
              <p className="text-neutral-400 text-sm">
                Contact support, report bugs, or share feedback to improve the platform.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Upcoming Milestones',
      content: (
        <div className="space-y-4">
          <p className="text-neutral-300 text-sm mb-4">
            Stay tuned for exciting new content and features:
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-24 text-center">
                <div className="text-cyan-400 font-bold text-sm">Oct 25</div>
                <div className="text-neutral-500 text-xs">Saturday</div>
              </div>
              <div className="flex-1 bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/50">
                <h4 className="text-gray-100 font-semibold mb-1">Module Pathway Update</h4>
                <p className="text-neutral-400 text-sm">New learning modules and pathway enhancements</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-24 text-center">
                <div className="text-cyan-400 font-bold text-sm">Mid Nov</div>
                <div className="text-neutral-500 text-xs">2025</div>
              </div>
              <div className="flex-1 bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/50">
                <h4 className="text-gray-100 font-semibold mb-1">Full Release</h4>
                <p className="text-neutral-400 text-sm">Complete platform launch with all core features</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-24 text-center">
                <div className="text-cyan-400 font-bold text-sm">December</div>
                <div className="text-neutral-500 text-xs">2025</div>
              </div>
              <div className="flex-1 bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/50">
                <h4 className="text-gray-100 font-semibold mb-1">Continual Updates</h4>
                <p className="text-neutral-400 text-sm">Certificates and Professor pathways rollout</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Ready to Begin!',
      content: (
        <div className="space-y-6 text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-5xl">🚀</span>
          </div>
          <div>
            <p className="text-neutral-300 text-lg leading-relaxed mb-4">
              You're all set to start your AI learning journey!
            </p>
            <p className="text-neutral-400 text-sm">
              Explore pathways, complete modules, and unlock achievements as you progress.
            </p>
          </div>
          <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg p-4">
            <p className="text-purple-200 text-sm font-medium">
              Good luck, and enjoy your learning adventure!
            </p>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-neutral-900 border border-neutral-700/50 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-100">{currentStepData.title}</h2>
              <div className="flex items-center gap-1.5">
                {steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentStep
                        ? 'w-8 bg-cyan-400'
                        : idx < currentStep
                        ? 'w-2 bg-cyan-400/50'
                        : 'w-2 bg-neutral-700'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="text-sm text-neutral-400 font-medium">
              {currentStep + 1} / {steps.length}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-8 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          {currentStepData.content}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-neutral-700/50 bg-neutral-900/50">
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="px-5 py-2.5 text-neutral-400 hover:text-gray-100 transition-colors duration-200 font-semibold tracking-wide text-sm"
            >
              SKIP
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold tracking-wide rounded-lg transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
            >
              {isLastStep ? 'GET STARTED' : 'NEXT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
