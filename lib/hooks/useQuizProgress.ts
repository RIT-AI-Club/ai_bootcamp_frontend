'use client';

import { useState, useEffect, useCallback } from 'react';

export interface QuizProgressState {
  currentQuestionIndex: number;
  selectedAnswers: Record<string, string>;
  timestamp: number;
  quizTitle: string;
}

interface UseQuizProgressReturn {
  savedProgress: QuizProgressState | null;
  saveProgress: (progress: Omit<QuizProgressState, 'timestamp'>) => void;
  clearProgress: () => void;
  hasProgress: boolean;
}

/**
 * Custom hook for persisting quiz progress to localStorage
 * Follows existing patterns from auth.ts and resource-service.ts
 *
 * @param quizId - Unique identifier for the quiz (e.g., resourceId)
 * @returns Object with saved progress state and control functions
 */
export function useQuizProgress(quizId: string): UseQuizProgressReturn {
  const [savedProgress, setSavedProgress] = useState<QuizProgressState | null>(null);
  const [hasProgress, setHasProgress] = useState(false);

  const storageKey = `quiz_progress_${quizId}`;

  // Load saved progress on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as QuizProgressState;

        // Check if progress is not too old (7 days)
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
        const isExpired = Date.now() - parsed.timestamp > sevenDaysInMs;

        if (isExpired) {
          // Clear expired progress
          localStorage.removeItem(storageKey);
          setSavedProgress(null);
          setHasProgress(false);
        } else {
          setSavedProgress(parsed);
          setHasProgress(true);
        }
      }
    } catch (error) {
      console.error('Failed to load quiz progress:', error);
      // Clear corrupted data
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  /**
   * Save current quiz progress to localStorage
   * Memoized with useCallback to prevent infinite re-renders
   */
  const saveProgress = useCallback((progress: Omit<QuizProgressState, 'timestamp'>) => {
    if (typeof window === 'undefined') return;

    try {
      const progressWithTimestamp: QuizProgressState = {
        ...progress,
        timestamp: Date.now(),
      };

      localStorage.setItem(storageKey, JSON.stringify(progressWithTimestamp));
      setSavedProgress(progressWithTimestamp);
      setHasProgress(true);
    } catch (error) {
      console.error('Failed to save quiz progress:', error);
    }
  }, [storageKey]);

  /**
   * Clear saved quiz progress from localStorage
   * Memoized with useCallback to prevent infinite re-renders
   */
  const clearProgress = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(storageKey);
      setSavedProgress(null);
      setHasProgress(false);
    } catch (error) {
      console.error('Failed to clear quiz progress:', error);
    }
  }, [storageKey]);

  return {
    savedProgress,
    saveProgress,
    clearProgress,
    hasProgress,
  };
}
