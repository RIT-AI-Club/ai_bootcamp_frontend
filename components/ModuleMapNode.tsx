'use client';

import { motion } from 'framer-motion';
import { Module } from '@/lib/pathways/types';

interface ModuleMapNodeProps {
  module: Module;
  index: number;
  isUnlocked: boolean;
  isCurrentModule?: boolean;
  pathwayColor: string;
  onClick: () => void;
}

export default function ModuleMapNode({
  module,
  index,
  isUnlocked,
  isCurrentModule = false,
  pathwayColor,
  onClick
}: ModuleMapNodeProps) {
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

  const getDifficultyRing = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'border-green-400/50';
      case 'intermediate':
        return 'border-yellow-400/50';
      case 'advanced':
        return 'border-red-400/50';
      default:
        return 'border-gray-400/50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative flex flex-col items-center"
    >
      {/* Connection line to next module */}
      {index < 4 && (
        <div className="absolute left-full top-1/2 w-16 h-0.5 bg-gradient-to-r from-neutral-600 to-neutral-700 -translate-y-1/2 z-0" />
      )}

      {/* Node Container */}
      <motion.div
        whileHover={isUnlocked ? { scale: 1.05 } : {}}
        whileTap={isUnlocked ? { scale: 0.95 } : {}}
        className={`relative cursor-pointer group ${!isUnlocked && 'cursor-not-allowed'}`}
        onClick={isUnlocked ? onClick : undefined}
      >
        {/* Outer glow ring for current module */}
        {isCurrentModule && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${pathwayColor} opacity-30 blur-md w-24 h-24 -translate-x-12 -translate-y-12`}
          />
        )}

        {/* Main node circle */}
        <div className={`relative w-20 h-20 rounded-full transition-all duration-300 ${
          isUnlocked 
            ? `bg-gradient-to-br ${pathwayColor} shadow-2xl shadow-black/50` 
            : 'bg-gradient-to-br from-neutral-700 to-neutral-800 shadow-lg shadow-black/30'
        }`}>
          
          {/* Inner depth ring */}
          <div className={`absolute inset-2 rounded-full border-2 transition-all duration-300 ${
            isUnlocked 
              ? getDifficultyRing(module.difficulty)
              : 'border-neutral-600/30'
          }`} />

          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            {module.completed ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-white text-xl font-bold"
              >
                ✓
              </motion.div>
            ) : (
              <div className={`text-lg font-bold ${
                isUnlocked ? 'text-white' : 'text-neutral-500'
              }`}>
                {index + 1}
              </div>
            )}
          </div>

          {/* Completion overlay */}
          {module.completed && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-500/20" />
          )}

          {/* Lock overlay for locked modules */}
          {!isUnlocked && (
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
              <div className="text-neutral-400 text-lg">🔒</div>
            </div>
          )}

          {/* Hover glow effect */}
          {isUnlocked && (
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${pathwayColor} opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
          )}
        </div>

        {/* Floating particles for completed modules */}
        {module.completed && isUnlocked && (
          <>
            <motion.div
              animate={{
                y: [-5, -15, -5],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0,
              }}
              className="absolute -top-2 -right-2 w-2 h-2 bg-yellow-400 rounded-full"
            />
            <motion.div
              animate={{
                y: [-8, -18, -8],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: 0.5,
              }}
              className="absolute -top-3 -left-1 w-1.5 h-1.5 bg-cyan-400 rounded-full"
            />
          </>
        )}
      </motion.div>

      {/* Module Info */}
      <motion.div
        className="mt-4 text-center max-w-32"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 + 0.2 }}
      >
        <h4 className={`text-sm font-semibold mb-1 leading-tight ${
          isUnlocked ? 'text-gray-100' : 'text-neutral-500'
        }`}>
          {module.title}
        </h4>
        
        <div className="flex items-center justify-center space-x-2 text-xs">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isUnlocked
              ? `bg-gradient-to-r ${getDifficultyColor(module.difficulty)} text-white`
              : 'bg-neutral-700 text-neutral-400'
          }`}>
            {module.difficulty}
          </span>
          <span className={`${isUnlocked ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {module.duration}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}