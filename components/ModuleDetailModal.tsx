'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Module } from '@/lib/pathways/types';

interface ModuleDetailModalProps {
  module: Module | null;
  isOpen: boolean;
  onClose: () => void;
  pathwayColor: string;
}

export default function ModuleDetailModal({
  module,
  isOpen,
  onClose,
  pathwayColor
}: ModuleDetailModalProps) {
  if (!module) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'from-green-400 to-green-500';
      case 'intermediate':
        return 'from-yellow-400 to-orange-500';
      case 'advanced':
        return 'from-red-400 to-pink-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '🎥';
      case 'article':
        return '📖';
      case 'exercise':
        return '💻';
      case 'project':
        return '🚀';
      default:
        return '📄';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={onClose}
          >
            <motion.div
              className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 rounded-3xl shadow-2xl border border-neutral-700/50 overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with gradient accent */}
              <div className={`relative bg-gradient-to-r ${pathwayColor} p-6 pb-20 flex-shrink-0`}>
                <div className="absolute inset-0 bg-black/20" />
                
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10 p-2 hover:bg-white/10 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Module status badge */}
                <div className="relative z-10">
                  {module.completed ? (
                    <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-400/30 rounded-full px-4 py-2 mb-4">
                      <span className="text-green-400 text-sm">✓</span>
                      <span className="text-green-100 text-sm font-medium">Completed</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-4">
                      <span className="text-white/80 text-sm">⏳</span>
                      <span className="text-white/90 text-sm font-medium">In Progress</span>
                    </div>
                  )}

                  <h2 className="text-3xl font-black text-white mb-2 leading-tight">
                    {module.title}
                  </h2>
                  
                  <div className="flex items-center space-x-4 text-white/80">
                    <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${getDifficultyColor(module.difficulty)} text-white text-sm font-medium`}>
                      {module.difficulty}
                    </div>
                    <span className="text-sm">⏱️ {module.duration}</span>
                    {(module as any).xp && (
                      <span className="text-sm">⭐ {(module as any).xp} XP</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 -mt-12 relative z-10 custom-scrollbar">
                {/* Description card */}
                <div className="bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-700/30 mb-6">
                  <h3 className="text-lg font-semibold text-gray-100/95 mb-3">About This Module</h3>
                  <p className="text-neutral-300 leading-relaxed">
                    {module.description}
                  </p>
                  
                  {/* Hardware note if exists */}
                  {(module as any).hardwareNote && (
                    <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <p className="text-amber-400 text-sm">
                        💡 <strong>Hardware Note:</strong> {(module as any).hardwareNote}
                      </p>
                    </div>
                  )}
                </div>

                {/* Topics */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-100/95 mb-4">What You'll Learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {module.topics.map((topic, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start space-x-3 bg-neutral-800/40 rounded-xl p-3 hover:bg-neutral-800/60 transition-colors"
                      >
                        <span className="text-cyan-400 mt-0.5">•</span>
                        <span className="text-neutral-300 text-sm">{topic}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                {module.resources && module.resources.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-100/95 mb-4">Learning Resources</h3>
                    <div className="space-y-3">
                      {module.resources.map((resource, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between bg-neutral-800/40 rounded-xl p-4 border border-neutral-700/20 hover:bg-neutral-800/60 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getResourceIcon(resource.type)}</span>
                            <div>
                              <h4 className="text-gray-100/90 font-medium">{resource.title}</h4>
                              <p className="text-neutral-400 text-sm capitalize">{resource.type}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            {resource.duration && (
                              <span className="text-neutral-400 text-sm">{resource.duration}</span>
                            )}
                            {resource.url ? (
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`px-4 py-2 bg-gradient-to-r ${pathwayColor} text-white rounded-lg text-sm font-medium hover:scale-105 transition-transform`}
                              >
                                Open
                              </a>
                            ) : (
                              <button className="px-4 py-2 bg-neutral-700/50 text-neutral-300 rounded-lg text-sm font-medium cursor-not-allowed">
                                Coming Soon
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Fixed Action buttons */}
              <div className="sticky bottom-0 bg-gradient-to-t from-neutral-900 via-neutral-900/95 to-transparent p-6 pt-8 flex-shrink-0">
                <div className="flex items-center justify-between border-t border-neutral-700/30 pt-4">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-neutral-700/50 text-neutral-300 rounded-lg hover:bg-neutral-700/70 transition-colors"
                  >
                    Close
                  </button>
                  
                  <div className="flex items-center space-x-3">
                    {!module.completed && (
                      <button className={`px-6 py-2 bg-gradient-to-r ${pathwayColor} text-white rounded-lg font-medium hover:scale-105 transition-transform shadow-lg`}>
                        Start Learning
                      </button>
                    )}
                    
                    {module.completed && (
                      <button className="px-6 py-2 bg-green-600/20 border border-green-500/30 text-green-400 rounded-lg font-medium">
                        ✓ Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}