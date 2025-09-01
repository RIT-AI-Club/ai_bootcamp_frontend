import { Achievement } from './types';

export const ACHIEVEMENTS: Achievement[] = [
  // Progress Achievements
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first module in any pathway',
    icon: '👶',
    rarity: 'common',
    category: 'progress',
    requirement: { type: 'modules_complete', value: 1 },
    isUnlocked: false,
    points: 10
  },
  {
    id: 'getting-started',
    title: 'Getting Started', 
    description: 'Reach 10% total progress across all pathways',
    icon: '🚀',
    rarity: 'common',
    category: 'progress', 
    requirement: { type: 'total_progress', value: 10 },
    isUnlocked: false,
    points: 25
  },
  {
    id: 'making-progress',
    title: 'Making Progress',
    description: 'Reach 25% total progress across all pathways', 
    icon: '📈',
    rarity: 'common',
    category: 'progress',
    requirement: { type: 'total_progress', value: 25 },
    isUnlocked: false,
    points: 50
  },
  {
    id: 'halfway-hero',
    title: 'Halfway Hero',
    description: 'Reach 50% total progress across all pathways',
    icon: '⚡',
    rarity: 'rare', 
    category: 'progress',
    requirement: { type: 'total_progress', value: 50 },
    isUnlocked: false,
    points: 100
  },
  {
    id: 'almost-there',
    title: 'Almost There',
    description: 'Reach 75% total progress across all pathways',
    icon: '🔥',
    rarity: 'rare',
    category: 'progress',
    requirement: { type: 'total_progress', value: 75 },
    isUnlocked: false,
    points: 150
  },

  // Completion Achievements
  {
    id: 'first-pathway',
    title: 'First Pathway Complete',
    description: 'Complete your very first pathway',
    icon: '🎯',
    rarity: 'rare',
    category: 'completion',
    requirement: { type: 'pathway_complete', value: 1 },
    isUnlocked: false,
    points: 200
  },
  {
    id: 'pathway-trio',
    title: 'Pathway Trio',
    description: 'Complete 3 different pathways',
    icon: '🏆',
    rarity: 'epic',
    category: 'completion',
    requirement: { type: 'pathway_complete', value: 3 },
    isUnlocked: false,
    points: 500
  },
  {
    id: 'pathway-master',
    title: 'Pathway Master',
    description: 'Complete 5 different pathways',
    icon: '👑',
    rarity: 'epic',
    category: 'completion', 
    requirement: { type: 'pathway_complete', value: 5 },
    isUnlocked: false,
    points: 1000
  },

  // Exploration Achievements
  {
    id: 'curious-learner',
    title: 'Curious Learner',
    description: 'Start learning in 3 different pathways',
    icon: '🔍',
    rarity: 'common',
    category: 'exploration',
    requirement: { type: 'pathways_started', value: 3 },
    isUnlocked: false,
    points: 30
  },
  {
    id: 'pathway-explorer',
    title: 'Pathway Explorer', 
    description: 'Start learning in 5 different pathways',
    icon: '🗺️',
    rarity: 'rare',
    category: 'exploration',
    requirement: { type: 'pathways_started', value: 5 },
    isUnlocked: false,
    points: 75
  },
  {
    id: 'knowledge-seeker',
    title: 'Knowledge Seeker',
    description: 'Start learning in 8 different pathways', 
    icon: '📚',
    rarity: 'epic',
    category: 'exploration',
    requirement: { type: 'pathways_started', value: 8 },
    isUnlocked: false,
    points: 150
  },

  // Mastery Achievements  
  {
    id: 'cv-master',
    title: 'Computer Vision Master',
    description: 'Complete the Computer Vision pathway',
    icon: '👁️',
    rarity: 'epic',
    category: 'mastery',
    requirement: { type: 'pathway_complete', value: 1, pathwayId: 'computer-vision' },
    isUnlocked: false,
    points: 300
  },
  {
    id: 'ml-ops-expert',
    title: 'MLOps Expert',
    description: 'Complete the MLOps pathway',
    icon: '⚙️',
    rarity: 'epic',
    category: 'mastery',
    requirement: { type: 'pathway_complete', value: 1, pathwayId: 'mlops' },
    isUnlocked: false,
    points: 300
  },
  {
    id: 'prompt-wizard',
    title: 'Prompt Engineering Wizard',
    description: 'Complete the Prompt Engineering pathway',
    icon: '🧙',
    rarity: 'epic', 
    category: 'mastery',
    requirement: { type: 'pathway_complete', value: 1, pathwayId: 'prompt-engineering' },
    isUnlocked: false,
    points: 300
  },

  // Special/Legendary Achievements
  {
    id: 'ai-bootcamp-graduate',
    title: 'AI Bootcamp Graduate',
    description: 'Complete ALL pathways in AI Bootcamp',
    icon: '🎓',
    rarity: 'legendary',
    category: 'completion',
    requirement: { type: 'pathway_complete', value: 13 },
    isUnlocked: false,
    points: 2500
  },
  {
    id: 'overachiever', 
    title: 'Overachiever',
    description: 'Reach 100% progress across all pathways',
    icon: '💎',
    rarity: 'legendary',
    category: 'progress',
    requirement: { type: 'total_progress', value: 100 },
    isUnlocked: false,
    points: 5000
  },
  {
    id: 'perfectionist',
    title: 'The Perfectionist',
    description: 'Complete 50 modules with perfect scores',
    icon: '✨',
    rarity: 'legendary',
    category: 'mastery', 
    requirement: { type: 'perfect_score', value: 50 },
    isUnlocked: false,
    points: 1000
  }
];

export const getRarityColor = (rarity: Achievement['rarity']) => {
  switch (rarity) {
    case 'common':
      return 'from-gray-400 to-gray-500';
    case 'rare':
      return 'from-blue-400 to-blue-600';
    case 'epic':
      return 'from-purple-400 to-purple-600';
    case 'legendary':
      return 'from-yellow-400 to-orange-500';
    default:
      return 'from-gray-400 to-gray-500';
  }
};

export const getRarityBorder = (rarity: Achievement['rarity']) => {
  switch (rarity) {
    case 'common':
      return 'border-gray-400/50';
    case 'rare':
      return 'border-blue-400/50';
    case 'epic':
      return 'border-purple-400/50';
    case 'legendary':
      return 'border-yellow-400/50';
    default:
      return 'border-gray-400/50';
  }
};