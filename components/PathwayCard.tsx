'use client';

import { useState } from 'react';
import MotionDiv from '@/components/MotionDiv';

export interface Pathway {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  instructor: string;
  progress: number; // 0-100
  color: string;
}

interface PathwayCardProps {
  pathway: Pathway;
  index: number;
  onClick: () => void;
}

export default function PathwayCard({ pathway, index, onClick }: PathwayCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Convert Tailwind color classes to actual colors for SVG gradients
  const getColorValues = (colorString: string) => {
    const colorMap: { [key: string]: string } = {
      'from-blue-500': '#3B82F6',
      'to-cyan-500': '#06B6D4',
      'from-purple-500': '#A855F7', 
      'to-pink-500': '#EC4899',
      'from-green-500': '#10B981',
      'to-emerald-500': '#10B981',
      'from-yellow-500': '#EAB308',
      'to-orange-500': '#F97316',
      'from-rose-500': '#F43F5E',
      'to-red-500': '#EF4444',
      'from-indigo-500': '#6366F1',
      'from-teal-500': '#14B8A6',
      'from-slate-500': '#64748B',
      'to-gray-500': '#6B7280',
      'from-violet-500': '#8B5CF6',
      'from-amber-500': '#F59E0B',
      'from-sky-500': '#0EA5E9',
      'from-emerald-500': '#10B981',
      'from-pink-500': '#EC4899',
      'to-teal-500': '#14B8A6',
      'to-rose-500': '#F43F5E'
    };
    
    const colors = colorString.split(' ');
    const fromColor = colorMap[colors[0]] || '#3B82F6';
    const toColor = colorMap[colors[1]] || '#06B6D4';
    
    return { fromColor, toColor };
  };
  
  const { fromColor, toColor } = getColorValues(pathway.color);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Main Card */}
      <div className="relative bg-gradient-to-br from-neutral-800/80 to-neutral-900/90 backdrop-blur-sm rounded-2xl p-6 h-48 border border-neutral-700/50 hover:border-neutral-600/60 transition-all duration-300 overflow-hidden group-hover:scale-[1.02]">
        
        {/* Progress Background */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${pathway.color} opacity-20 transition-all duration-300`}
            style={{ height: `${pathway.progress}%` }}
          />
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${pathway.color} opacity-5`}
            style={{ height: '100%' }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-100/95 leading-tight">
                {pathway.shortTitle}
              </h3>
            </div>
            
            {/* Progress Circle with Glass Effect */}
            <div className="relative w-12 h-12 ml-3">
              {/* Glass background */}
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-800/60 to-neutral-900/60 backdrop-blur-sm rounded-full border border-neutral-700/30" />
              
              <svg className="w-12 h-12 transform -rotate-90 relative z-10" viewBox="0 0 48 48">
                {/* Background Circle */}
                <circle
                  cx="24"
                  cy="24"
                  r="18"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="none"
                  className="text-neutral-700/30"
                />
                {/* Progress Circle */}
                <circle
                  cx="24"
                  cy="24"
                  r="18"
                  stroke="url(#gradient-${pathway.id})"
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 18}`}
                  strokeDashoffset={`${2 * Math.PI * 18 * (1 - pathway.progress / 100)}`}
                  className="transition-all duration-500 filter drop-shadow-sm"
                  strokeLinecap="round"
                />
                {/* Gradient Definition */}
                <defs>
                  <linearGradient id={`gradient-${pathway.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={fromColor} />
                    <stop offset="100%" stopColor={toColor} />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Subtle inner glow */}
              <div className={`absolute inset-2 rounded-full bg-gradient-to-br ${pathway.color} opacity-10 blur-sm`} />
              
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <span className="text-xs font-semibold text-neutral-300/90">
                  {pathway.progress}%
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="space-y-2">
            {/* Progress Bar */}
            <div className="w-full bg-neutral-700/30 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${pathway.color} transition-all duration-700 ease-out rounded-full`}
                style={{ width: `${pathway.progress}%` }}
              />
            </div>
            
            {/* Status */}
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-400">
                {pathway.progress === 0 ? 'Not Started' : 
                 pathway.progress === 100 ? 'Completed' : 'In Progress'}
              </span>
              <span className="text-neutral-500">
                Click to explore →
              </span>
            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${pathway.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
        
        {/* Subtle shine effect on hover */}
        <div className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${pathway.color} opacity-0 group-hover:opacity-60 transition-opacity duration-300`} />
        </div>
      </div>

      {/* Floating hover effect */}
      {isHovered && (
        <MotionDiv
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -left-2 -right-2 -bottom-2 rounded-3xl bg-gradient-to-br from-neutral-600/20 to-neutral-800/20 -z-10 blur-xl"
        />
      )}
    </MotionDiv>
  );
}