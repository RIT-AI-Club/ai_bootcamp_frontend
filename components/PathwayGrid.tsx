'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import PathwayCard, { Pathway } from './PathwayCard';
import { PathwayManager } from '@/lib/pathways/pathway-manager';

export default function PathwayGrid() {
  const router = useRouter();
  const pathways = PathwayManager.getPathwayMeta();

  const handlePathwayClick = (pathway: Pathway) => {
    console.log(`Navigating to pathway: ${pathway.title}`);
    router.push(`/pathway/${pathway.slug}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-wider text-gray-100/95 select-none mb-4">
          AI BOOTCAMP
        </h1>
        <p className="text-lg text-neutral-400 font-medium">
          Choose your learning pathway and start your AI journey
        </p>
        <div className="mt-4 text-sm text-neutral-500">
          {pathways.length} specialized pathways • Expert instructors • Hands-on projects
        </div>
      </motion.div>

      {/* Pathway Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
      >
        {pathways.map((pathway, index) => (
          <PathwayCard
            key={pathway.id}
            pathway={pathway}
            index={index}
            onClick={() => handlePathwayClick(pathway)}
          />
        ))}
      </motion.div>

      {/* Stats Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="bg-neutral-800/40 backdrop-blur-sm rounded-xl p-4 border border-neutral-700/30">
            <div className="text-2xl font-bold text-gray-100/95">
              {pathways.filter(p => p.progress > 0).length}
            </div>
            <div className="text-sm text-neutral-400">Started</div>
          </div>
          
          <div className="bg-neutral-800/40 backdrop-blur-sm rounded-xl p-4 border border-neutral-700/30">
            <div className="text-2xl font-bold text-gray-100/95">
              {pathways.filter(p => p.progress === 100).length}
            </div>
            <div className="text-sm text-neutral-400">Completed</div>
          </div>
          
          <div className="bg-neutral-800/40 backdrop-blur-sm rounded-xl p-4 border border-neutral-700/30">
            <div className="text-2xl font-bold text-gray-100/95">
              {Math.round(pathways.reduce((acc, p) => acc + p.progress, 0) / pathways.length)}%
            </div>
            <div className="text-sm text-neutral-400">Overall Progress</div>
          </div>
        </div>
        
        <p className="text-xs text-neutral-500 max-w-lg mx-auto">
          Track your progress across all pathways. Each pathway contains multiple modules 
          with hands-on projects and real-world applications.
        </p>
      </motion.div>
    </div>
  );
}