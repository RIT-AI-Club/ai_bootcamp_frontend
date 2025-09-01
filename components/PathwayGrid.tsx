'use client';

import { motion } from 'framer-motion';
import PathwayCard, { Pathway } from './PathwayCard';

const pathways: Pathway[] = [
  {
    id: 'computer-vision',
    title: 'Computer Vision',
    shortTitle: 'Computer Vision',
    instructor: 'Olivier',
    progress: 75,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'reinforcement-learning',
    title: 'Reinforcement Learning',
    shortTitle: 'RL',
    instructor: 'Roman',
    progress: 45,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'mlops-colab',
    title: 'MLops (Google Colab)',
    shortTitle: 'MLops',
    instructor: 'Olivier',
    progress: 100,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'ai-ethics',
    title: 'AI Ethics',
    shortTitle: 'AI Ethics',
    instructor: 'Sage',
    progress: 30,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'image-generation',
    title: 'Image Generation / Artistic',
    shortTitle: 'Image Generation',
    instructor: 'Roman',
    progress: 60,
    color: 'from-rose-500 to-red-500'
  },
  {
    id: 'llm-creation',
    title: 'LLM creation (Google Collab)',
    shortTitle: 'LLM Creation',
    instructor: 'Roman',
    progress: 20,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'ai-apis',
    title: 'APIs for AI (Python)',
    shortTitle: 'AI APIs',
    instructor: 'Olivier',
    progress: 85,
    color: 'from-teal-500 to-green-500'
  },
  {
    id: 'devops',
    title: 'DevOps (GitHub / GoogleCloud)',
    shortTitle: 'DevOps',
    instructor: 'Roman',
    progress: 40,
    color: 'from-slate-500 to-gray-500'
  },
  {
    id: 'vibecoding',
    title: 'Vibecoding (Free tools, N8N)',
    shortTitle: 'Vibecoding',
    instructor: 'Roman',
    progress: 90,
    color: 'from-violet-500 to-purple-500'
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering',
    shortTitle: 'Prompt Engineering',
    instructor: 'Roman',
    progress: 100,
    color: 'from-amber-500 to-yellow-500'
  },
  {
    id: 'ai-agents',
    title: 'AI Agents (MCP, Tooling)',
    shortTitle: 'AI Agents',
    instructor: 'Olivier',
    progress: 15,
    color: 'from-sky-500 to-blue-500'
  },
  {
    id: 'vector-db-rag',
    title: 'Vector DB/RAG/Database',
    shortTitle: 'Vector DB/RAG',
    instructor: 'Olivier',
    progress: 55,
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'ai-research',
    title: 'AI research',
    shortTitle: 'AI Research',
    instructor: 'Roman',
    progress: 10,
    color: 'from-pink-500 to-rose-500'
  }
];

export default function PathwayGrid() {
  const handlePathwayClick = (pathway: Pathway) => {
    console.log(`Clicked on pathway: ${pathway.title}`);
    // TODO: Navigate to pathway detail page
    // router.push(`/pathway/${pathway.id}`);
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