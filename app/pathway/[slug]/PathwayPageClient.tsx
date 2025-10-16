'use client';

import { useState, useEffect } from 'react';
import { PathwayData, Module } from '@/lib/pathways/types';
import PathwayMap from '@/components/PathwayMap';
import ModuleDetailModal from '@/components/ModuleDetailModal';
import BetaBadge from '@/components/BetaBadge';
import { ProgressService } from '@/lib/progress/progress-service';
import { useHydration } from '@/lib/hooks/useHydration';
import MotionDiv from '@/components/MotionDiv';

interface PathwayPageClientProps {
  pathway: PathwayData;
}

export default function PathwayPageClient({ pathway: initialPathway }: PathwayPageClientProps) {
  const [pathway, setPathway] = useState<PathwayData>(initialPathway);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false); // Don't show loading initially
  const isHydrated = useHydration();

  // Fetch progress data on client-side mount (after hydration)
  useEffect(() => {
    if (!isHydrated) return; // Wait for hydration

    const fetchProgress = async () => {
      setIsLoadingProgress(true);
      try {
        const pathwayProgress = await ProgressService.fetchPathwayProgress(pathway.id);

        // Update pathway with progress data
        setPathway(prevPathway => ({
          ...prevPathway,
          progress: pathwayProgress.progress,
          modules: prevPathway.modules.map(module => ({
            ...module,
            completed: pathwayProgress.completedModules.includes(module.id)
          }))
        }));
      } catch (error) {
        console.error('Failed to fetch progress:', error);
        // Keep the default progress values from SSR
      } finally {
        setIsLoadingProgress(false);
      }
    };

    fetchProgress();
  }, [isHydrated, pathway.id]);

  const handleModuleClick = (module: Module) => {
    setSelectedModule(module);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedModule(null);
  };

  const handleModuleComplete = async (moduleId: string) => {
    try {
      // Mark module as complete in backend
      await ProgressService.markModuleComplete(pathway.id, moduleId);

      // Update local state
      setPathway(prevPathway => {
        const updatedModules = prevPathway.modules.map(module =>
          module.id === moduleId ? { ...module, completed: true } : module
        );

        // Calculate new progress percentage
        const completedCount = updatedModules.filter(m => m.completed).length;
        const newProgress = Math.round((completedCount / updatedModules.length) * 100);

        return {
          ...prevPathway,
          modules: updatedModules,
          progress: newProgress
        };
      });
    } catch (error) {
      console.error('Failed to mark module complete:', error);
    }
  };

  return (
    <>
      <div className="min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-neutral-800">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-neutral-800/20 to-neutral-600/10" />
        </div>
        
        <div className="relative z-10 min-h-screen">
          {/* Header */}
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <a 
                href="/dashboard" 
                className="text-gray-100/90 hover:text-gray-100/60 transition-colors duration-200 font-semibold tracking-wider"
              >
                ← BACK TO DASHBOARD
              </a>
            </div>
          </MotionDiv>

          {/* Pathway Info Section - Top 1/2 of screen */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="px-6 md:px-8 pb-8"
          >
            <div className="max-w-7xl mx-auto">
              {/* Hero Section */}
              <div className="text-center mb-12">
                <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${pathway.color} mb-6 shadow-lg`}>
                  <span className="text-sm font-semibold text-white">
                    {pathway.level.toUpperCase()} • {pathway.duration}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-7xl font-black tracking-wider text-gray-100/95 mb-6 leading-tight">
                  {pathway.title}
                </h1>
                
                <p className="text-xl text-neutral-400 mb-8 max-w-3xl mx-auto leading-relaxed">
                  {pathway.description}
                </p>
                
                <div className="flex items-center justify-center space-x-8 text-sm text-neutral-500">
                  <div className="flex items-center space-x-2">
                    <span>👨‍🏫</span>
                    <span>{pathway.instructor}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>📈</span>
                    <span>
                      {pathway.progress || 0}% Complete
                      {isHydrated && isLoadingProgress && (
                        <span className="ml-1 text-xs animate-pulse">(updating...)</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>⭐</span>
                    <span>{pathway.rating}/5</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>👥</span>
                    <span>{pathway.enrolledCount?.toLocaleString()} enrolled</span>
                  </div>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid lg:grid-cols-3 gap-8 mb-12">
                {/* Overview */}
                <div className="lg:col-span-2 bg-neutral-800/60 backdrop-blur-sm rounded-3xl p-8 border border-neutral-700/30">
                  <h2 className="text-2xl font-bold text-gray-100/95 mb-6">Course Overview</h2>
                  <p className="text-neutral-300 leading-relaxed mb-8 text-lg">
                    {pathway.overview}
                  </p>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-100/95 mb-4">What You'll Master</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {pathway.learningOutcomes.map((outcome, index) => (
                        <MotionDiv
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="flex items-start space-x-3 bg-neutral-700/30 rounded-xl p-3"
                        >
                          <span className="text-cyan-400 mt-1">✓</span>
                          <span className="text-neutral-300">{outcome}</span>
                        </MotionDiv>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Side Info */}
                <div className="space-y-6">
                  {/* Prerequisites */}
                  <MotionDiv
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-700/30"
                  >
                    <h3 className="text-lg font-semibold text-gray-100/95 mb-4">Prerequisites</h3>
                    <ul className="space-y-2">
                      {pathway.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-start space-x-2 text-neutral-300 text-sm">
                          <span className="text-neutral-500 mt-1">•</span>
                          <span>{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </MotionDiv>

                  {/* Tools */}
                  <MotionDiv
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-700/30"
                  >
                    <h3 className="text-lg font-semibold text-gray-100/95 mb-4">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {pathway.tools.map((tool, index) => (
                        <span 
                          key={index}
                          className={`px-3 py-2 bg-gradient-to-r ${pathway.color} bg-opacity-20 border border-neutral-600/30 rounded-full text-xs text-neutral-300 font-medium`}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </MotionDiv>
                </div>
              </div>
            </div>
          </MotionDiv>

          {/* Game Map Section - Bottom 1/2 of screen */}
          <MotionDiv
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="px-6 md:px-8 pb-12"
          >
            <div className="max-w-7xl mx-auto">
              <PathwayMap
                modules={pathway.modules}
                pathwayColor={pathway.color}
                pathwayProgress={pathway.progress || 0}
                onModuleClick={handleModuleClick}
              />
            </div>
          </MotionDiv>
        </div>
      </div>

      {/* Module Detail Modal */}
      <ModuleDetailModal
        module={selectedModule}
        isOpen={isModalOpen}
        onClose={closeModal}
        pathwayColor={pathway.color}
        onModuleComplete={handleModuleComplete}
      />

      {/* Beta Badge */}
      <BetaBadge />
    </>
  );
}