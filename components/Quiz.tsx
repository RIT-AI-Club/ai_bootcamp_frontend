'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export type QuestionType = 'multiple-choice' | 'true-false';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: QuizOption[];
  explanation?: string;
}

export interface QuizData {
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore?: number; // Percentage (0-100)
}

interface QuizProps {
  quizData: QuizData;
  onComplete?: (score: number, passed: boolean) => void;
  accentColor?: string; // Tailwind gradient classes like "from-blue-500 to-cyan-500"
}

export default function Quiz({ quizData, onComplete, accentColor = 'from-blue-500 to-cyan-500' }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const totalQuestions = quizData.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const passingScore = quizData.passingScore || 80; // Default 80% passing score

  const handleOptionSelect = (optionId: string) => {
    if (showFeedback) return; // Prevent changing answer after submission

    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: optionId,
    });
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswers[currentQuestion.id]) return;

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
    } else {
      // Calculate final score
      const correctAnswers = quizData.questions.filter(question => {
        const selectedOption = question.options.find(
          opt => opt.id === selectedAnswers[question.id]
        );
        return selectedOption?.isCorrect;
      }).length;

      const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
      const passed = finalScore >= passingScore;

      setScore(finalScore);
      setQuizCompleted(true);
      onComplete?.(finalScore, passed);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowFeedback(false);
    setQuizCompleted(false);
    setScore(0);
  };

  const isAnswerCorrect = () => {
    const selectedOption = currentQuestion.options.find(
      opt => opt.id === selectedAnswers[currentQuestion.id]
    );
    return selectedOption?.isCorrect || false;
  };

  const getCorrectAnswer = () => {
    return currentQuestion.options.find(opt => opt.isCorrect);
  };

  if (quizCompleted) {
    const passed = score >= passingScore;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl mx-auto"
      >
        <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="text-center">
            {/* Score circle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto mb-6 sm:mb-8"
            >
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-neutral-700"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  className={passed ? 'text-green-500' : 'text-red-500'}
                  initial={{ strokeDashoffset: 553 }}
                  animate={{ strokeDashoffset: 553 - (553 * score) / 100 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  style={{ strokeDasharray: 553 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <div className={`text-3xl sm:text-4xl md:text-5xl font-black ${passed ? 'text-green-400' : 'text-red-400'}`}>
                  {score}%
                </div>
                <div className="text-neutral-400 text-xs sm:text-sm mt-1">Score</div>
              </div>
            </motion.div>

            {/* Result message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100 mb-3 sm:mb-4 px-2">
                {passed ? '🎉 Congratulations!' : '📚 Keep Practicing!'}
              </h2>
              <p className="text-neutral-300 text-base sm:text-lg mb-6 sm:mb-8 px-2">
                {passed
                  ? `You passed the quiz with ${score}%! Great job!`
                  : `You scored ${score}%. You need ${passingScore}% to pass. Try again!`}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-md mx-auto mb-6 sm:mb-8">
                <div className="bg-neutral-800/60 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-100">
                    {Object.keys(selectedAnswers).length}
                  </div>
                  <div className="text-[10px] sm:text-xs text-neutral-400">Answered</div>
                </div>
                <div className="bg-neutral-800/60 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-400">
                    {quizData.questions.filter(q => {
                      const opt = q.options.find(o => o.id === selectedAnswers[q.id]);
                      return opt?.isCorrect;
                    }).length}
                  </div>
                  <div className="text-[10px] sm:text-xs text-neutral-400">Correct</div>
                </div>
                <div className="bg-neutral-800/60 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-red-400">
                    {quizData.questions.filter(q => {
                      const opt = q.options.find(o => o.id === selectedAnswers[q.id]);
                      return opt && !opt.isCorrect;
                    }).length}
                  </div>
                  <div className="text-[10px] sm:text-xs text-neutral-400">Wrong</div>
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={handleRetakeQuiz}
                className={`px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r ${accentColor} text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg text-sm sm:text-base`}
              >
                Retake Quiz
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 sm:mb-6"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-100 mb-2">{quizData.title}</h2>
        {quizData.description && (
          <p className="text-sm sm:text-base text-neutral-400">{quizData.description}</p>
        )}
      </motion.div>

      {/* Progress bar */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs sm:text-sm text-neutral-400">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-xs sm:text-sm text-neutral-400">{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${accentColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6"
        >
          {/* Question */}
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-100 mb-4 sm:mb-6">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="space-y-2 sm:space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion.id] === option.id;
              const isCorrectOption = option.isCorrect;
              const showCorrect = showFeedback && isCorrectOption;
              const showWrong = showFeedback && isSelected && !isCorrectOption;

              return (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={showFeedback}
                  className={`
                    w-full text-left p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all
                    ${
                      showCorrect
                        ? 'bg-green-500/20 border-green-500/50'
                        : showWrong
                        ? 'bg-red-500/20 border-red-500/50'
                        : isSelected
                        ? `bg-gradient-to-r ${accentColor} bg-opacity-20 border-blue-500/50`
                        : 'bg-neutral-800/40 border-neutral-700/30 hover:border-neutral-600/50 hover:bg-neutral-800/60'
                    }
                    ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-neutral-200 font-medium text-sm sm:text-base">{option.text}</span>
                    {showCorrect && <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0" />}
                    {showWrong && <XCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 flex-shrink-0" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 sm:mt-6"
              >
                <div
                  className={`p-3 sm:p-4 rounded-lg sm:rounded-xl ${
                    isAnswerCorrect()
                      ? 'bg-green-500/10 border border-green-500/30'
                      : 'bg-red-500/10 border border-red-500/30'
                  }`}
                >
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    {isAnswerCorrect() ? (
                      <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-semibold mb-1 text-sm sm:text-base ${
                          isAnswerCorrect() ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {isAnswerCorrect() ? 'Correct!' : 'Incorrect'}
                      </p>
                      {currentQuestion.explanation && (
                        <p className="text-neutral-300 text-xs sm:text-sm break-words">{currentQuestion.explanation}</p>
                      )}
                      {!isAnswerCorrect() && (
                        <p className="text-neutral-400 text-xs sm:text-sm mt-2 break-words">
                          Correct answer: {getCorrectAnswer()?.text}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex justify-between items-center gap-2 sm:gap-4">
        <button
          onClick={() => {
            if (currentQuestionIndex > 0) {
              setCurrentQuestionIndex(currentQuestionIndex - 1);
              setShowFeedback(false);
            }
          }}
          disabled={currentQuestionIndex === 0}
          className="px-4 sm:px-6 py-2 bg-neutral-700/50 text-neutral-300 rounded-lg hover:bg-neutral-700/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          Previous
        </button>

        {!showFeedback ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswers[currentQuestion.id]}
            className={`px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r ${accentColor} text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base`}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className={`px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r ${accentColor} text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg text-sm sm:text-base`}
          >
            {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        )}
      </div>
    </div>
  );
}
