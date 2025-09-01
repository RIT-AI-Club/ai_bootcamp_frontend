'use client';

import { motion } from 'framer-motion';
import { AchievementManager } from '@/lib/achievements/achievement-manager';

interface AchievementIconProps {
  onClick: () => void;
}

export default function AchievementIcon({ onClick }: AchievementIconProps) {
  const stats = AchievementManager.getUserAchievementStats();
  const hasNewAchievements = stats.recentUnlocks.length > 0;
  
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative group"
    >
      {/* Main trophy circle */}
      <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm shadow-lg border-2 border-yellow-400/50 flex items-center justify-center transition-all duration-300 group-hover:shadow-xl group-hover:shadow-yellow-500/20 group-hover:border-yellow-400/70">
        
        {/* Trophy icon */}
        <div className="text-yellow-400 text-xl font-bold">
          🏆
        </div>
        
        {/* Subtle inner glow */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-yellow-400/20 to-transparent pointer-events-none" />
      </div>

      {/* Achievement count badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-black flex items-center justify-center"
      >
        <span className="text-white text-xs font-bold">
          {stats.unlockedCount}
        </span>
      </motion.div>


      {/* Hover tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        <div className="text-center">
          <div className="font-semibold">Achievements</div>
          <div className="text-neutral-300">{stats.unlockedCount}/{stats.totalCount} unlocked</div>
          <div className="text-yellow-400">{stats.totalPoints} points</div>
        </div>
        
        {/* Tooltip arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/80" />
      </div>

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
  );
}