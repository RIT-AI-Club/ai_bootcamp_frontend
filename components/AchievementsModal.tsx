'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '@/lib/achievements/types';
import { ACHIEVEMENTS, getRarityColor, getRarityBorder } from '@/lib/achievements/achievements-data';
import { AchievementManager } from '@/lib/achievements/achievement-manager';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AchievementsModal({ isOpen, onClose }: AchievementsModalProps) {
  // For now using mock data - will be replaced with backend call
  const achievements = AchievementManager.calculateUserAchievements();
  const stats = AchievementManager.getUserAchievementStats();
  const achievementsByCategory = AchievementManager.getAchievementsByCategory();

  const categories = [
    { key: 'progress', label: 'Progress', icon: '📈', color: 'from-blue-500 to-cyan-500' },
    { key: 'completion', label: 'Completion', icon: '🎯', color: 'from-green-500 to-emerald-500' },
    { key: 'exploration', label: 'Exploration', icon: '🔍', color: 'from-purple-500 to-pink-500' },
    { key: 'mastery', label: 'Mastery', icon: '👑', color: 'from-yellow-500 to-orange-500' },
  ];

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
        achievement.isUnlocked
          ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)}/20 ${getRarityBorder(achievement.rarity)}`
          : 'bg-neutral-800/40 border-neutral-700/30'
      }`}
    >
      {/* Achievement Icon */}
      <div className="flex items-start space-x-4">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${
          achievement.isUnlocked
            ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} shadow-lg`
            : 'bg-neutral-700/50'
        }`}>
          {achievement.isUnlocked ? achievement.icon : '🔒'}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-bold ${
              achievement.isUnlocked ? 'text-gray-100' : 'text-neutral-500'
            }`}>
              {achievement.title}
            </h3>
            <div className="flex items-center space-x-2">
              {/* Rarity indicator */}
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                achievement.isUnlocked
                  ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`
                  : 'bg-neutral-700 text-neutral-400'
              }`}>
                {achievement.rarity}
              </div>
              {/* Points */}
              <div className="text-yellow-400 text-sm font-semibold">
                {achievement.isUnlocked ? achievement.points : '???'} pts
              </div>
            </div>
          </div>
          
          <p className={`text-sm ${
            achievement.isUnlocked ? 'text-neutral-300' : 'text-neutral-500'
          }`}>
            {achievement.isUnlocked ? achievement.description : 'Complete requirements to unlock this achievement'}
          </p>
          
          {/* Unlock date */}
          {achievement.isUnlocked && achievement.unlockedAt && (
            <div className="mt-2 text-xs text-neutral-400">
              Unlocked on {achievement.unlockedAt.toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* New achievement glow */}
      {achievement.isUnlocked && stats.recentUnlocks.includes(achievement) && (
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 pointer-events-none"
        />
      )}
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              className="relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 rounded-3xl shadow-2xl border border-neutral-700/50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-yellow-500 to-orange-500 p-8">
                <div className="absolute inset-0 bg-black/20" />
                
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-4xl">🏆</div>
                    <div>
                      <h2 className="text-3xl font-black text-white">Trophy Case</h2>
                      <p className="text-white/80">Your AI Bootcamp achievements</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-white">{stats.unlockedCount}</div>
                      <div className="text-white/70 text-sm">Unlocked</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-white">{stats.totalPoints}</div>
                      <div className="text-white/70 text-sm">Points</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-white">{Math.round(stats.completionPercentage)}%</div>
                      <div className="text-white/70 text-sm">Complete</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-white">{stats.recentUnlocks.length}</div>
                      <div className="text-white/70 text-sm">Recent</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[60vh]">
                {categories.map((category, categoryIndex) => {
                  const categoryAchievements = achievementsByCategory[category.key as keyof typeof achievementsByCategory] || [];
                  if (categoryAchievements.length === 0) return null;

                  return (
                    <motion.div
                      key={category.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: categoryIndex * 0.1 }}
                      className="mb-8"
                    >
                      {/* Category Header */}
                      <div className="flex items-center space-x-3 mb-6">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-lg`}>
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-100">{category.label}</h3>
                          <p className="text-neutral-400 text-sm">
                            {categoryAchievements.filter(a => a.isUnlocked).length}/{categoryAchievements.length} unlocked
                          </p>
                        </div>
                      </div>

                      {/* Achievement Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categoryAchievements.map((achievement, index) => (
                          <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: categoryIndex * 0.1 + index * 0.05 }}
                          >
                            <AchievementCard achievement={achievement} />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Empty state if no achievements */}
                {achievements.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏆</div>
                    <h3 className="text-xl font-semibold text-gray-100 mb-2">Start Learning to Earn Achievements!</h3>
                    <p className="text-neutral-400">Complete modules and pathways to unlock your first trophy.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}