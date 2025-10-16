'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AchievementManager } from '@/lib/achievements/achievement-manager';
import { UserAchievementStats } from '@/lib/achievements/types';
import { useToast } from '@/lib/contexts/ToastContext';

interface AchievementIconProps {
  onClick: () => void;
}

export default function AchievementIcon({ onClick }: AchievementIconProps) {
  const { showToast } = useToast();
  const [stats, setStats] = useState<UserAchievementStats>({
    totalPoints: 0,
    unlockedCount: 0,
    totalCount: 0,
    completionPercentage: 0,
    recentUnlocks: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const achievementStats = await AchievementManager.getUserAchievementStats();
        setStats(achievementStats);
      } catch (error) {
        console.error('Failed to load achievement stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const hasNewAchievements = stats.recentUnlocks.length > 0;

  const handleClick = () => {
    showToast('Achievements coming soon!', 'info');
  };

  return (
    <div className="relative inline-block">
      <motion.button
        onClick={handleClick}
        className="relative group cursor-pointer opacity-60"
      >
      {/* Main trophy circle */}
      <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm shadow-lg border-2 border-yellow-400/50 flex items-center justify-center transition-all duration-300">

        {/* Trophy icon */}
        <div className="text-yellow-400 text-xl font-bold">
          {loading ? '⏳' : '🏆'}
        </div>

        {/* Subtle inner glow */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-yellow-400/20 to-transparent pointer-events-none" />
      </div>

      {/* Achievement count badge */}
      {!loading && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-black flex items-center justify-center"
        >
          <span className="text-white text-xs font-bold">
            {stats.unlockedCount}
          </span>
        </motion.div>
      )}



      {/* Floating particles for celebration */}
      {hasNewAchievements && (
        <>
          <motion.div
            animate={{
              y: [-2, -8, -2],
              x: [-1, 1, -1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0,
            }}
            className="absolute -top-2 -left-1 w-1 h-1 bg-yellow-400 rounded-full pointer-events-none"
          />
          <motion.div
            animate={{
              y: [-1, -6, -1],
              x: [1, -1, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              delay: 0.3,
            }}
            className="absolute -top-1 -right-2 w-0.5 h-0.5 bg-orange-400 rounded-full pointer-events-none"
          />
          <motion.div
            animate={{
              y: [-3, -7, -3],
              x: [0, 2, 0],
              opacity: [0.5, 0.9, 0.5],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: 0.6,
            }}
            className="absolute -top-3 right-0 w-0.5 h-0.5 bg-yellow-300 rounded-full pointer-events-none"
          />
        </>
      )}
    </motion.button>

    {/* Coming Soon Tooltip */}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-neutral-800/95 backdrop-blur-sm text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-neutral-700/50">
      <div className="flex items-center space-x-1.5">
        <svg className="w-3 h-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span className="font-semibold text-neutral-300">Coming Soon</span>
      </div>
      {/* Tooltip arrow */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800/95" />
    </div>
  </div>
  );
}