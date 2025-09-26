'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressService } from '@/lib/progress/progress-service';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AchievementsModal({ isOpen, onClose }: AchievementsModalProps) {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAchievementData = async () => {
      if (!isOpen) return;

      try {
        const achievementsList = await ProgressService.fetchAllAchievements();
        setAchievements(achievementsList);
      } catch (error) {
        console.error('Failed to load achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAchievementData();
  }, [isOpen]);

  const earnedAchievements = achievements.filter(a => a.earned);
  const lockedAchievements = achievements.filter(a => !a.earned);

  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'pathway': return '🏆';
      case 'module': return '📚';
      case 'streak': return '🔥';
      case 'milestone': return '⚡';
      case 'special': return '💎';
      default: return '🎯';
    }
  };

  const AchievementCard = ({ achievement }: { achievement: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
        achievement.earned
          ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30'
          : 'bg-neutral-800/40 border-neutral-700/30'
      }`}
    >
      <div className="flex items-start space-x-4">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${
          achievement.earned
            ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg'
            : 'bg-neutral-700/50'
        }`}>
          {achievement.earned ? (achievement.icon || getIconForCategory(achievement.category)) : '🔒'}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-bold ${
              achievement.earned ? 'text-gray-100' : 'text-neutral-500'
            }`}>
              {achievement.name}
            </h3>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              achievement.earned
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                : 'bg-neutral-700 text-neutral-400'
            }`}>
              {achievement.category}
            </div>
          </div>

          <p className={`text-sm ${
            achievement.earned ? 'text-neutral-300' : 'text-neutral-500'
          }`}>
            {achievement.earned ? achievement.description : 'Complete requirements to unlock this achievement'}
          </p>

          {achievement.earned && achievement.earned_at && (
            <div className="mt-2 text-xs text-neutral-400">
              Unlocked on {new Date(achievement.earned_at).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-4xl max-h-[80vh] bg-gradient-to-br from-neutral-900/95 to-neutral-800/95 backdrop-blur-xl rounded-3xl border border-neutral-700/50 overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-neutral-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100 mb-2">Achievements</h2>
                    <div className="flex items-center space-x-6 text-sm text-neutral-400">
                      <span>🏆 Earned: {earnedAchievements.length}</span>
                      <span>🔒 Locked: {lockedAchievements.length}</span>
                      <span>📊 Total: {achievements.length}</span>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl bg-neutral-800/50 hover:bg-neutral-700/50 text-neutral-400 hover:text-gray-100 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-neutral-400">Loading achievements...</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Earned Achievements */}
                    {earnedAchievements.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
                          <span className="text-yellow-500 mr-2">🏆</span>
                          Earned Achievements
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {earnedAchievements.map((achievement) => (
                            <AchievementCard key={achievement.id} achievement={achievement} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Locked Achievements */}
                    {lockedAchievements.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
                          <span className="text-neutral-500 mr-2">🔒</span>
                          Locked Achievements
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {lockedAchievements.map((achievement) => (
                            <AchievementCard key={achievement.id} achievement={achievement} />
                          ))}
                        </div>
                      </div>
                    )}

                    {achievements.length === 0 && !loading && (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎯</div>
                        <p className="text-neutral-400">No achievements available yet.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}