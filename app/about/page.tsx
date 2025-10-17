'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function AboutPage() {
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
          <div className="max-w-5xl w-full">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-8 text-center">
              About AI Bootcamp
            </h1>

            {/* Main Content Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Left Column - Roman's Photo */}
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-6 shadow-2xl w-full">
                  <div className="relative w-full h-64 md:h-80 mb-4 rounded-xl overflow-hidden">
                    <Image
                      src="/profile_picture_transparent.png"
                      alt="Roman Slack"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 300px"
                      className="object-contain"
                      priority
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-100 text-center mb-1">Roman Slack</h3>
                  <p className="text-sm text-cyan-400 text-center font-medium">Lead Developer & Creator</p>

                  {/* Social Links */}
                  <div className="flex items-center justify-center gap-4 mt-3 mb-2">
                    <a
                      href="https://github.com/RomanSlack"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-100/70 hover:text-cyan-400 transition-colors duration-200"
                      aria-label="GitHub Profile"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    <a
                      href="https://linkedin.com/in/roman-slack-a91a6a266"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-100/70 hover:text-cyan-400 transition-colors duration-200"
                      aria-label="LinkedIn Profile"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  </div>

                  <p className="text-xs text-neutral-400 text-center">RIT AI Club E-Board</p>
                </div>
              </div>

              {/* Right Column - Project Info */}
              <div className="md:col-span-2 space-y-6">
                {/* Mission Section */}
                <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-6 md:p-8 shadow-2xl">
                  <h2 className="text-2xl font-bold text-gray-100 mb-4">The Mission</h2>
                  <p className="text-neutral-300 leading-relaxed mb-4">
                    AI Bootcamp was created to provide a <span className="text-cyan-400 font-semibold">free, accessible resource</span> for
                    learning AI tools and techniques in today's rapidly evolving landscape. This project represents a commitment to
                    <span className="text-cyan-400 font-semibold"> democratizing AI education</span> and spreading knowledge to everyone who wants to learn.
                  </p>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-blue-200/90 text-sm">
                      Built in collaboration with the <span className="font-semibold text-blue-300">RIT AI Club</span>, this platform
                      serves as a comprehensive learning pathway for students and enthusiasts alike.
                    </p>
                  </div>
                </div>

                {/* Development Section */}
                <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-6 md:p-8 shadow-2xl">
                  <h2 className="text-2xl font-bold text-gray-100 mb-4">Development</h2>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg p-4">
                      <p className="text-gray-100 font-semibold mb-2">🚀 Technical Achievement</p>
                      <p className="text-neutral-300 text-sm leading-relaxed">
                        <span className="text-cyan-400 font-bold">100% of the codebase</span> was developed using a
                        <span className="text-purple-400 font-semibold"> custom Claude Code prompting structure</span> that Roman Slack
                        designed. This innovative approach demonstrates the power of AI-assisted development and serves as a testament
                        to what's possible with the right methodology.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="bg-neutral-800/50 rounded-lg p-4">
                        <p className="text-sm text-neutral-400 mb-1">Full-Stack Development</p>
                        <p className="text-gray-100 font-medium">
                          <span className="text-cyan-400">Roman Slack</span> — Entire codebase architecture, backend, frontend, deployment
                        </p>
                      </div>
                      <div className="bg-neutral-800/50 rounded-lg p-4">
                        <p className="text-sm text-neutral-400 mb-1">Curriculum & Content</p>
                        <p className="text-gray-100 font-medium">
                          <span className="text-cyan-400">Roman Slack</span> & <span className="text-cyan-400">Olivier Couthaud</span> — Pathways, modules, and educational content
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stack Section */}
            <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl p-6 md:p-8 shadow-2xl mb-8">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-100">Technology Stack</h2>
                <a
                  href="https://github.com/RIT-AI-Club/ai_bootcamp_backend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-medium"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View Source
                </a>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
                <p className="text-green-200/90 text-sm font-medium">
                  ✨ 100% Open Source — The entire codebase is publicly available on GitHub
                </p>
              </div>
              <p className="text-neutral-400 mb-4 text-sm">
                For detailed technical information, see the <span className="text-cyan-400 font-medium">README.md</span> in the project repository.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-neutral-800/50 rounded-lg p-3 text-center">
                  <p className="text-blue-400 font-semibold text-sm">Next.js 15</p>
                  <p className="text-neutral-500 text-xs">Frontend</p>
                </div>
                <div className="bg-neutral-800/50 rounded-lg p-3 text-center">
                  <p className="text-green-400 font-semibold text-sm">FastAPI</p>
                  <p className="text-neutral-500 text-xs">Backend</p>
                </div>
                <div className="bg-neutral-800/50 rounded-lg p-3 text-center">
                  <p className="text-purple-400 font-semibold text-sm">PostgreSQL</p>
                  <p className="text-neutral-500 text-xs">Database</p>
                </div>
                <div className="bg-neutral-800/50 rounded-lg p-3 text-center">
                  <p className="text-cyan-400 font-semibold text-sm">Cloud Run</p>
                  <p className="text-neutral-500 text-xs">Deployment</p>
                </div>
              </div>
            </div>

            {/* RIT AI Club Section */}
            <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30 rounded-2xl p-6 md:p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-100 mb-3">RIT AI Club</h2>
              <p className="text-neutral-300 leading-relaxed">
                This project is developed in partnership with the <span className="text-orange-400 font-bold">Rochester Institute of Technology AI Club</span>.
                Both Roman Slack and Olivier Couthaud serve on the E-Board, working to advance AI education and foster a
                community of learners passionate about artificial intelligence and its applications.
              </p>
            </div>

            {/* Footer Message */}
            <div className="mt-8 text-center">
              <p className="text-neutral-400 italic text-sm">
                Thank you for being part of our journey to make AI education accessible to all.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
