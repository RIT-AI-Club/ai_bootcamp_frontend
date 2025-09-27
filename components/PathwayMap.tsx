'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Module } from '@/lib/pathways/types';
import ModuleMapNode from './ModuleMapNode';
import MotionDiv from './MotionDiv';

interface PathwayMapProps {
  modules: Module[];
  pathwayColor: string;
  pathwayProgress: number;
  onModuleClick: (module: Module) => void;
}

export default function PathwayMap({
  modules,
  pathwayColor,
  pathwayProgress,
  onModuleClick
}: PathwayMapProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Calculate how many modules should be unlocked based on progress
  const completedModules = modules.filter(m => m.completed).length;
  const totalModules = modules.length;
  const progressRatio = pathwayProgress / 100;
  const unlockedCount = Math.min(Math.max(completedModules + 1, Math.ceil(progressRatio * totalModules)), totalModules);

  // Find current module (first incomplete unlocked module)
  const currentModuleIndex = modules.findIndex(m => !m.completed && modules.indexOf(m) < unlockedCount);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollTo = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  // Auto-scroll to current module on mount
  useEffect(() => {
    if (scrollContainerRef.current && currentModuleIndex >= 0) {
      const nodeWidth = 200; // Approximate width including spacing
      const targetScroll = Math.max(0, currentModuleIndex * nodeWidth - 400);
      
      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
      }, 500);
    }
  }, [currentModuleIndex]);

  useEffect(() => {
    checkScrollButtons();
  }, []);

  // Create path points for the connecting line
  const pathPoints = modules.map((_, index) => ({
    x: index * 200 + 100, // Center of each node
    y: 60 + (index % 2 === 0 ? 0 : 40) // Zig-zag pattern
  }));

  return (
    <div className="relative w-full bg-gradient-to-br from-neutral-900/80 to-neutral-800/80 backdrop-blur-sm rounded-3xl border border-neutral-700/30 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-neutral-700/30">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-100/95">Learning Path</h3>
          <div className="flex items-center space-x-4 text-sm text-neutral-400">
            <span>{completedModules}/{totalModules} modules completed</span>
            <span>•</span>
            <span>{pathwayProgress}% progress</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 w-full bg-neutral-700/30 rounded-full h-2">
          <MotionDiv
            className={`h-full bg-gradient-to-r ${pathwayColor} rounded-full`}
            initial={{ width: '0%' }}
            animate={{ width: `${pathwayProgress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>

      {/* Map Container */}
      <div className="relative p-6">
        {/* Scroll buttons */}
        {canScrollLeft && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => scrollTo('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full border border-neutral-600/50 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            ←
          </MotionDiv>
        )}

        {canScrollRight && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => scrollTo('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full border border-neutral-600/50 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            →
          </MotionDiv>
        )}

        {/* Scrollable content */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide pb-4"
          onScroll={checkScrollButtons}
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <div className="relative" style={{ width: `${modules.length * 200}px`, minHeight: '280px' }}>
            
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="grid grid-cols-12 gap-4 h-full">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="border-r border-neutral-600 h-full" />
                  ))}
                </div>
              </div>
              
              {/* Floating particles */}
              {Array.from({ length: 8 }).map((_, i) => {
                // Use deterministic positioning based on index
                const leftPos = (i * 13.7 + 7.3) % 100; // Pseudo-random but deterministic
                const topPos = (i * 17.1 + 11.9) % 100;
                const duration = 3 + (i % 3); // 3, 4, or 5 seconds
                const delay = (i * 0.3) % 2; // 0 to ~2 seconds

                return (
                  <MotionDiv
                    key={i}
                    className="absolute w-1 h-1 bg-neutral-500 rounded-full"
                    style={{
                      left: `${leftPos}%`,
                      top: `${topPos}%`,
                    }}
                    animate={{
                      y: [-10, 10, -10],
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                      duration,
                      repeat: Infinity,
                      delay,
                    }}
                  />
                );
              })}
            </div>

            {/* Connecting path SVG */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ width: '100%', height: '280px' }}
            >
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" className="text-neutral-600" stopColor="currentColor" />
                  <stop offset={`${(unlockedCount / modules.length) * 100}%`} className="text-neutral-500" stopColor="currentColor" />
                  <stop offset="100%" className="text-neutral-700" stopColor="currentColor" />
                </linearGradient>
              </defs>
              
              {/* Create curved path between nodes */}
              {pathPoints.slice(0, -1).map((point, index) => {
                const nextPoint = pathPoints[index + 1];
                const midX = (point.x + nextPoint.x) / 2;
                const controlOffset = index % 2 === 0 ? -20 : 20;
                
                return (
                  <path
                    key={index}
                    d={`M ${point.x} ${point.y} Q ${midX} ${point.y + controlOffset} ${nextPoint.x} ${nextPoint.y}`}
                    stroke="url(#pathGradient)"
                    strokeWidth="2"
                    fill="none"
                    className="drop-shadow-sm"
                  />
                );
              })}
            </svg>

            {/* Module nodes */}
            <div className="relative flex items-start space-x-28 pt-8">
              {modules.map((module, index) => {
                const isUnlocked = index < unlockedCount;
                const isCurrentModule = index === currentModuleIndex;
                const yOffset = index % 2 === 0 ? 0 : 40;
                
                return (
                  <div
                    key={module.id}
                    className="relative flex-shrink-0"
                    style={{ 
                      transform: `translateY(${yOffset}px)`,
                      zIndex: isCurrentModule ? 10 : 5
                    }}
                  >
                    <ModuleMapNode
                      module={module}
                      index={index}
                      isUnlocked={isUnlocked}
                      isCurrentModule={isCurrentModule}
                      pathwayColor={pathwayColor}
                      onClick={() => onModuleClick(module)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-neutral-700/30">
          <div className="flex items-center justify-center space-x-6 text-xs text-neutral-400">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-green-500"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${pathwayColor}`}></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-700 relative">
                <div className="absolute inset-0 flex items-center justify-center text-neutral-400 text-xs">🔒</div>
              </div>
              <span>Locked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}