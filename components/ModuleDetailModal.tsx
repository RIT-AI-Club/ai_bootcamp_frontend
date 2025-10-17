'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Module } from '@/lib/pathways/types';
import ResourceItem from './ResourceItem';
import { useState, useEffect, useMemo } from 'react';
import { ResourceService, type ResourceCompletion, type ResourceSubmission } from '@/lib/resources/resource-service';

interface ModuleDetailModalProps {
  module: Module | null;
  isOpen: boolean;
  onClose: () => void;
  pathwayColor: string;
  pathwayId: string;
  onModuleComplete?: (moduleId: string) => void;
}

export default function ModuleDetailModal({
  module,
  isOpen,
  onClose,
  pathwayColor,
  pathwayId,
  onModuleComplete
}: ModuleDetailModalProps) {
  const [resourceCompletedCount, setResourceCompletedCount] = useState(0);
  const [resourcesProgress, setResourcesProgress] = useState<Map<string, { completion?: ResourceCompletion; submissions: ResourceSubmission[] }>>(new Map());
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);

  // Fetch all resources progress when module opens - OPTIMIZED with single API call
  useEffect(() => {
    if (!module || !isOpen) return;

    const fetchAllProgress = async () => {
      setIsLoadingProgress(true);

      // SINGLE API call to get all resources with progress
      const resourcesWithProgress = await ResourceService.getModuleResourcesWithProgress(module.id);

      // Map to resource ID for easy lookup
      const progressMap = new Map();
      resourcesWithProgress.forEach((resource) => {
        progressMap.set(resource.id, {
          completion: resource.completion || null,
          submissions: resource.submissions || []
        });
      });

      setResourcesProgress(progressMap);
      setIsLoadingProgress(false);
    };

    fetchAllProgress();
  }, [module, isOpen]);

  // Calculate if all resources are completed
  const allResourcesComplete = useMemo(() => {
    if (!module || !module.resources || module.resources.length === 0) return true;
    if (isLoadingProgress) return false;

    const totalResources = module.resources.length;

    for (let i = 0; i < totalResources; i++) {
      const resourceId = `${module.id}-r${i + 1}`;
      const progressData = resourcesProgress.get(resourceId);
      const resource = module.resources[i];

      // Check if resource is completed
      if (!progressData?.completion ||
          !['completed', 'submitted', 'reviewed'].includes(progressData.completion.status)) {
        // Resource is not complete
        return false;
      }

      // For quiz resources - completion status already means they passed (80%+)
      // Quizzes only mark as complete if user passes, so no additional check needed

      // Check if upload is required and submitted with at least one upload
      if ((resource.type === 'exercise' || resource.type === 'project')) {
        if (!progressData?.submissions || progressData.submissions.length === 0) {
          // Missing required upload
          return false;
        }
        // Note: We check for uploads but don't require approval here
        // Approval is checked at module completion by backend
      }
    }

    return true;
  }, [module, resourcesProgress, isLoadingProgress]);

  if (!module) return null;

  const handleResourceComplete = () => {
    setResourceCompletedCount(prev => prev + 1);
  };

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
              {/* Close button - Outside header for better clickability */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all"
                aria-label="Close modal"
              >
                <span className="text-white text-2xl font-light leading-none">×</span>
              </button>

              {/* Header with gradient accent */}
              <div className={`relative bg-gradient-to-r ${pathwayColor} p-6 flex-shrink-0`}>
                <div className="absolute inset-0 bg-black/20" />

                {/* Module status badge */}
                <div className="relative z-10">
                  {module.completed && module.approval_status === 'approved' && (
                    <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-400/30 rounded-full px-4 py-2 mb-4">
                      <span className="text-green-400 text-sm">✓</span>
                      <span className="text-green-100 text-sm font-medium">Approved</span>
                    </div>
                  )}
                  {module.completed && module.approval_status === 'pending' && (
                    <div className="inline-flex items-center space-x-2 bg-yellow-500/20 border border-yellow-400/30 rounded-full px-4 py-2 mb-4">
                      <span className="text-yellow-400 text-sm">⏳</span>
                      <span className="text-yellow-100 text-sm font-medium">Pending Review</span>
                    </div>
                  )}
                  {module.completed && module.approval_status === 'rejected' && (
                    <div className="inline-flex items-center space-x-2 bg-red-500/20 border border-red-400/30 rounded-full px-4 py-2 mb-4">
                      <span className="text-red-400 text-sm">✗</span>
                      <span className="text-red-100 text-sm font-medium">Needs Revision</span>
                    </div>
                  )}
                  {!module.completed && (
                    <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-4">
                      <span className="text-white/80 text-sm">⏳</span>
                      <span className="text-white/90 text-sm font-medium">In Progress</span>
                    </div>
                  )}

                  <h2 className="text-3xl font-black text-white mb-2 leading-tight pr-12">
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
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {/* Review Comments - Show if rejected */}
                {module.approval_status === 'rejected' && module.review_comments && (
                  <div className="bg-red-500/10 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30 mb-6">
                    <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
                      <span>✗</span>
                      <span>Instructor Feedback</span>
                    </h3>
                    <p className="text-red-200 leading-relaxed">
                      {module.review_comments}
                    </p>
                  </div>
                )}

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
                    {isLoadingProgress && (
                      <div className="text-sm text-neutral-400 mb-3">Loading progress...</div>
                    )}
                    <div className="space-y-3">
                      {module.resources.map((resource, index) => {
                        // Generate resource ID: {module_id}-r{index+1}
                        const resourceId = `${module.id}-r${index + 1}`;
                        const progressData = resourcesProgress.get(resourceId);

                        return (
                          <ResourceItem
                            key={resourceId}
                            resource={resource}
                            resourceId={resourceId}
                            pathwayId={pathwayId}
                            moduleId={module.id}
                            pathwayColor={pathwayColor}
                            index={index}
                            initialCompletion={progressData?.completion}
                            initialSubmissions={progressData?.submissions}
                            onComplete={handleResourceComplete}
                            onUploadSuccess={handleResourceComplete}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Fixed Action buttons */}
              <div className="sticky bottom-0 bg-gradient-to-t from-neutral-900 via-neutral-900/95 to-transparent p-6 pt-8 flex-shrink-0">
                <div className="flex items-center justify-end border-t border-neutral-700/30 pt-4">
                  <div className="flex items-center space-x-3">
                    {!module.completed && (
                      <button
                        onClick={() => allResourcesComplete && onModuleComplete?.(module.id)}
                        disabled={!allResourcesComplete}
                        className={`px-6 py-2 rounded-lg font-medium transition-transform shadow-lg ${
                          allResourcesComplete
                            ? 'bg-green-600 hover:bg-green-700 text-white hover:scale-105 cursor-pointer'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-60'
                        }`}
                        title={!allResourcesComplete ? 'Complete all resources first' : 'Submit for instructor review'}
                      >
                        {allResourcesComplete ? 'Submit for Review' : 'Complete All Resources First'}
                      </button>
                    )}

                    {module.completed && module.approval_status === 'approved' && (
                      <button className="px-6 py-2 bg-green-600/20 border border-green-500/30 text-green-400 rounded-lg font-medium">
                        ✓ Approved
                      </button>
                    )}

                    {module.completed && module.approval_status === 'pending' && (
                      <button className="px-6 py-2 bg-yellow-600/20 border border-yellow-500/30 text-yellow-400 rounded-lg font-medium">
                        ⏳ Awaiting Review
                      </button>
                    )}

                    {module.completed && module.approval_status === 'rejected' && (
                      <button
                        onClick={() => onModuleComplete?.(module.id)}
                        className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium hover:scale-105 transition-transform shadow-lg"
                      >
                        Resubmit for Review
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