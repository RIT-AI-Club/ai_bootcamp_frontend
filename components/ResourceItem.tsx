'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, CloudArrowUpIcon, PlayCircleIcon } from '@heroicons/react/24/outline';
import { ResourceService, type ResourceCompletion, type ResourceSubmission } from '@/lib/resources/resource-service';
import Quiz, { type QuizData } from './Quiz';

interface Resource {
  type: 'video' | 'article' | 'exercise' | 'project' | 'quiz';
  title: string;
  url?: string;
  duration?: string;
}

interface ResourceItemProps {
  resource: Resource;
  resourceId: string; // Backend resource ID
  pathwayId: string;
  moduleId: string;
  pathwayColor: string;
  index: number;
  initialCompletion?: ResourceCompletion | null;
  initialSubmissions?: ResourceSubmission[];
  onComplete?: () => void;
  onUploadSuccess?: () => void;
}

export default function ResourceItem({
  resource,
  resourceId,
  pathwayId,
  moduleId,
  pathwayColor,
  index,
  initialCompletion,
  initialSubmissions = [],
  onComplete,
  onUploadSuccess
}: ResourceItemProps) {
  const [completion, setCompletion] = useState<ResourceCompletion | null>(initialCompletion || null);
  const [submissions, setSubmissions] = useState<ResourceSubmission[]>(initialSubmissions);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

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
      case 'quiz':
        return '📝';
      default:
        return '📄';
    }
  };

  const handleStart = async () => {
    const result = await ResourceService.startResource(resourceId);
    if (result) {
      setCompletion(result);
    }
  };

  const handleOpenQuiz = async () => {
    if (!resource.url) return;

    setLoadingQuiz(true);
    try {
      const response = await fetch(resource.url);
      const data = await response.json();
      setQuizData(data);
      setShowQuiz(true);

      // Mark as started
      await handleStart();
    } catch (error) {
      console.error('Failed to load quiz:', error);
      setUploadError('Failed to load quiz data');
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleQuizComplete = async (score: number, passed: boolean) => {
    // Only mark as completed if passed (80% or configured passing score)
    if (passed) {
      const result = await ResourceService.completeResource(resourceId);
      if (result) {
        setCompletion(result);
        onComplete?.();
      }
    } else {
      // Quiz failed - don't mark as complete, allow retake
      console.log(`Quiz failed with score ${score}%. Passing score required.`);
    }
  };

  const handleComplete = async () => {
    const result = await ResourceService.completeResource(resourceId);
    if (result) {
      // Update local state with the completion result
      setCompletion(result);
      onComplete?.();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = ResourceService.validateFile(file, undefined, 25); // 25MB max for now
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const result = await ResourceService.uploadFile(resourceId, file);
      if (result) {
        // Refresh submissions
        const subs = await ResourceService.getResourceSubmissions(resourceId);
        setSubmissions(subs);

        // Refresh completion status
        const progress = await ResourceService.getResourceProgress(resourceId);
        if (progress) {
          setCompletion(progress);
        }

        setShowUpload(false);
        onUploadSuccess?.();
      }
    } catch (error: any) {
      setUploadError(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  // Sync with initialCompletion when it changes (on modal reopen)
  useEffect(() => {
    if (initialCompletion) {
      setCompletion(initialCompletion);
    }
    if (initialSubmissions) {
      setSubmissions(initialSubmissions);
    }
  }, [initialCompletion, initialSubmissions]);

  const isCompleted = completion?.status === 'completed' || completion?.status === 'reviewed';
  const isSubmitted = completion?.status === 'submitted';
  const requiresUpload = resource.type === 'exercise' || resource.type === 'project';
  const latestSubmission = submissions[0]; // Submissions are ordered by created_at DESC

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-xl p-4 border transition-colors ${
        isCompleted
          ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/15'
          : 'bg-neutral-800/40 border-neutral-700/20 hover:bg-neutral-800/60'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Icon and Info */}
        <div className="flex items-start gap-3 flex-1">
          <span className="text-2xl flex-shrink-0">{getResourceIcon(resource.type)}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-gray-100/90 font-medium">{resource.title}</h4>
              {isCompleted && (
                <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
              )}
              {isSubmitted && (
                <CloudArrowUpIcon className="w-5 h-5 text-blue-400 flex-shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-3 text-sm text-neutral-400">
              <span className="capitalize">{resource.type}</span>
              {resource.duration && <span>• {resource.duration}</span>}
              {requiresUpload && (
                <span className="text-amber-400">• Upload Required</span>
              )}
            </div>

            {/* Submission Status */}
            {latestSubmission && (
              <div className="mt-2 text-xs">
                {latestSubmission.submission_status === 'approved' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-green-400">
                    ✓ Approved {latestSubmission.grade && `(${latestSubmission.grade})`}
                  </span>
                )}
                {latestSubmission.submission_status === 'rejected' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 border border-red-500/30 rounded text-red-400">
                    ✗ Needs Revision
                  </span>
                )}
                {latestSubmission.submission_status === 'uploaded' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-400">
                    ⏳ Under Review
                  </span>
                )}
              </div>
            )}

            {/* Upload Error */}
            {uploadError && (
              <div className="mt-2 text-xs text-red-400">
                {uploadError}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {resource.duration && (
            <span className="text-neutral-400 text-sm hidden md:block">{resource.duration}</span>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Quiz Button */}
            {resource.type === 'quiz' && resource.url ? (
              <button
                onClick={handleOpenQuiz}
                disabled={loadingQuiz || isCompleted}
                className={`px-4 py-2 bg-gradient-to-r ${pathwayColor} text-white rounded-lg text-sm font-medium hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <PlayCircleIcon className="w-4 h-4" />
                {loadingQuiz ? 'Loading...' : isCompleted ? 'Completed' : 'Start Quiz'}
              </button>
            ) : resource.type === 'quiz' && !resource.url ? (
              <button
                className="px-4 py-2 bg-neutral-700/50 text-neutral-300 rounded-lg text-sm font-medium cursor-not-allowed"
                disabled
              >
                Coming Soon
              </button>
            ) : resource.url ? (
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleStart}
                className={`px-4 py-2 bg-gradient-to-r ${pathwayColor} text-white rounded-lg text-sm font-medium hover:scale-105 transition-transform flex items-center gap-2`}
              >
                <PlayCircleIcon className="w-4 h-4" />
                Open
              </a>
            ) : (
              <button
                className="px-4 py-2 bg-neutral-700/50 text-neutral-300 rounded-lg text-sm font-medium cursor-not-allowed"
                disabled
              >
                Coming Soon
              </button>
            )}

            {/* Upload/Resubmit Button (for exercises/projects) */}
            {requiresUpload && (
              <button
                onClick={() => setShowUpload(!showUpload)}
                className={`px-4 py-2 text-white rounded-lg text-sm font-medium hover:scale-105 transition-transform flex items-center gap-2 ${
                  submissions.length > 0
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                <CloudArrowUpIcon className="w-4 h-4" />
                {submissions.length > 0 ? 'Resubmit' : 'Upload'}
              </button>
            )}

            {/* Complete Button - Only for non-quiz, non-upload resources */}
            {!isCompleted && resource.type !== 'quiz' && !requiresUpload && (
              <button
                onClick={handleComplete}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium hover:scale-105 transition-transform"
              >
                Complete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      {showUpload && requiresUpload && (
        <div className="mt-4 p-4 bg-neutral-900/60 rounded-lg border border-neutral-700/30">
          <h5 className="text-sm font-semibold text-gray-100/90 mb-2">Upload Your Work</h5>
          <p className="text-xs text-neutral-400 mb-3">
            Submit your completed {resource.type} for review
          </p>

          <label className="block">
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="block w-full text-sm text-neutral-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-gradient-to-r file:from-cyan-600 file:to-blue-600
                file:text-white
                hover:file:bg-gradient-to-r hover:file:from-cyan-700 hover:file:to-blue-700
                file:cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </label>

          {isUploading && (
            <div className="mt-2 text-sm text-blue-400">
              Uploading...
            </div>
          )}

          {/* Previous Submissions */}
          {submissions.length > 0 && (
            <div className="mt-4">
              <h6 className="text-xs font-semibold text-gray-100/80 mb-2">Previous Submissions</h6>
              <div className="space-y-2">
                {submissions.slice(0, 3).map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between text-xs bg-neutral-800/40 rounded p-2">
                    <span className="text-neutral-300">{sub.file_name}</span>
                    <span className={`px-2 py-1 rounded ${
                      sub.submission_status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      sub.submission_status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {sub.submission_status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quiz Modal */}
      <AnimatePresence>
        {showQuiz && quizData && (
          <>
            {/* Backdrop - no onClick to prevent closing */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
            />

            {/* Modal - no onClick to prevent closing */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 overflow-y-auto pointer-events-none"
            >
              <motion.div
                className="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-neutral-700/50 overflow-y-auto my-auto p-4 sm:p-6 md:p-8 pointer-events-auto"
              >
                {/* Close button - only visible on completion screen */}
                <button
                  onClick={() => setShowQuiz(false)}
                  className="sticky top-2 sm:absolute sm:top-4 sm:right-4 md:top-6 md:right-6 z-10 ml-auto flex w-8 h-8 sm:w-10 sm:h-10 items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all mb-2 sm:mb-0"
                  aria-label="Close quiz"
                >
                  <span className="text-white text-xl sm:text-2xl font-light leading-none">×</span>
                </button>

                {/* Quiz Component */}
                <Quiz
                  quizData={quizData}
                  quizId={resourceId}
                  onComplete={handleQuizComplete}
                  accentColor={pathwayColor}
                />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
