import { PathwayData, PathwayMeta } from './types';
import { ProgressService, DashboardData } from '@/lib/progress/progress-service';

// Import all pathway JSON files
const pathwayModules = {
  'computer-vision': () => import('@/data/pathways/computer-vision.json'),
  'reinforcement-learning': () => import('@/data/pathways/reinforcement-learning.json'),
  'mlops': () => import('@/data/pathways/mlops.json'),
  'ai-ethics': () => import('@/data/pathways/ai-ethics.json'),
  'image-generation': () => import('@/data/pathways/image-generation.json'),
  'llm-creation': () => import('@/data/pathways/llm-creation.json'),
  'ai-apis': () => import('@/data/pathways/ai-apis.json'),
  'devops': () => import('@/data/pathways/devops.json'),
  'vibecoding': () => import('@/data/pathways/vibecoding.json'),
  'prompt-engineering': () => import('@/data/pathways/prompt-engineering.json'),
  'ai-agents': () => import('@/data/pathways/ai-agents.json'),
  'vector-db-rag': () => import('@/data/pathways/vector-db-rag.json'),
  'ai-research': () => import('@/data/pathways/ai-research.json'),
};

// Pathway metadata for quick access (used in dashboard grid)
export const PATHWAY_META: PathwayMeta[] = [
  {
    id: 'computer-vision',
    slug: 'computer-vision',
    title: 'Computer Vision',
    shortTitle: 'Computer Vision',
    instructor: 'Olivier',
    color: 'from-blue-500 to-cyan-500',
    progress: 0,
    isAvailable: false,
  },
  {
    id: 'reinforcement-learning',
    slug: 'reinforcement-learning',
    title: 'Reinforcement Learning',
    shortTitle: 'RL',
    instructor: 'Roman',
    color: 'from-purple-500 to-pink-500',
    progress: 0,
    isAvailable: false,
  },
  {
    id: 'mlops',
    slug: 'mlops',
    title: 'MLops (Google Colab)',
    shortTitle: 'MLops',
    instructor: 'Olivier',
    color: 'from-green-500 to-emerald-500',
    progress: 0,
    isAvailable: false,
  },
  {
    id: 'ai-ethics',
    slug: 'ai-ethics',
    title: 'AI Ethics',
    shortTitle: 'AI Ethics',
    instructor: 'Sage',
    color: 'from-yellow-500 to-orange-500',
    progress: 0,
    isAvailable: false,
  },
  {
    id: 'image-generation',
    slug: 'image-generation',
    title: 'Image Generation / Artistic',
    shortTitle: 'Image Generation',
    instructor: 'Roman',
    color: 'from-rose-500 to-red-500',
    progress: 0,
    isAvailable: true,
  },
  {
    id: 'llm-creation',
    slug: 'llm-creation',
    title: 'LLM creation (Google Collab)',
    shortTitle: 'LLM Creation',
    instructor: 'Roman',
    color: 'from-indigo-500 to-purple-500',
    progress: 0,
    isAvailable: false,
  },
  {
    id: 'ai-apis',
    slug: 'ai-apis',
    title: 'APIs for AI (Python)',
    shortTitle: 'AI APIs',
    instructor: 'Olivier',
    color: 'from-teal-500 to-green-500',
    progress: 0,
    isAvailable: false,
  },
  {
    id: 'devops',
    slug: 'devops',
    title: 'DevOps (GitHub / GoogleCloud)',
    shortTitle: 'DevOps',
    instructor: 'Roman',
    color: 'from-slate-500 to-gray-500',
    progress: 0,
    isAvailable: false,
  },
  {
    id: 'vibecoding',
    slug: 'vibecoding',
    title: 'Vibecoding (Free tools, N8N)',
    shortTitle: 'Vibecoding',
    instructor: 'Roman',
    color: 'from-violet-500 to-purple-500',
    progress: 0,
    isAvailable: false,
  },
  {
    id: 'prompt-engineering',
    slug: 'prompt-engineering',
    title: 'Prompt Engineering',
    shortTitle: 'Prompt Engineering',
    instructor: 'Roman',
    color: 'from-amber-500 to-yellow-500',
    progress: 0,
    isAvailable: true,
  },
  {
    id: 'ai-agents',
    slug: 'ai-agents',
    title: 'AI Agents (MCP, Tooling)',
    shortTitle: 'AI Agents',
    instructor: 'Olivier',
    color: 'from-sky-500 to-blue-500',
    progress: 0,
    isAvailable: false,
  },
  {
    id: 'vector-db-rag',
    slug: 'vector-db-rag',
    title: 'Vector DB/RAG/Database',
    shortTitle: 'Vector DB/RAG',
    instructor: 'Olivier',
    color: 'from-emerald-500 to-teal-500',
    progress: 0,
    isAvailable: false,
  },
  {
    id: 'ai-research',
    slug: 'ai-research',
    title: 'AI research',
    shortTitle: 'AI Research',
    instructor: 'Roman',
    color: 'from-pink-500 to-rose-500',
    progress: 0,
    isAvailable: false,
  },
];

export class PathwayManager {
  /**
   * Get pathway metadata for dashboard display with real progress
   */
  static async getPathwayMeta(): Promise<PathwayMeta[]> {
    try {
      // Use optimized single API call instead of multiple calls
      const completeData = await ProgressService.fetchCompleteData();

      // Map pathways data to PathwayMeta format
      return completeData.pathways.map(pathway => {
        // Find the corresponding pathway in PATHWAY_META to get isAvailable
        const metaPathway = PATHWAY_META.find(p => p.id === pathway.id);
        return {
          id: pathway.id,
          slug: pathway.slug,
          title: pathway.title,
          shortTitle: pathway.shortTitle,
          instructor: pathway.instructor,
          color: pathway.color,
          progress: pathway.progress,
          isAvailable: metaPathway?.isAvailable ?? true // Default to true if not found
        };
      });
    } catch (error) {
      console.error('Failed to fetch pathway data:', error);
      // Return base metadata with 0 progress on error
      return PATHWAY_META;
    }
  }

  /**
   * Fetch user progress from backend and merge with pathway metadata
   */
  static async fetchUserProgress(): Promise<PathwayMeta[]> {
    try {
      const userProgress = await ProgressService.fetchUserProgress();

      // Merge user progress with pathway metadata
      return PATHWAY_META.map(pathway => ({
        ...pathway,
        progress: userProgress.pathwayProgress[pathway.id]?.progress || 0
      }));
    } catch (error) {
      console.error('Failed to fetch user progress:', error);
      // Return base metadata with 0 progress on error
      return PATHWAY_META;
    }
  }

  /**
   * Get pathway by slug with user progress (client-side) or without progress (server-side)
   */
  static async getPathwayBySlug(slug: string): Promise<PathwayData | null> {
    try {
      const moduleLoader = pathwayModules[slug as keyof typeof pathwayModules];
      if (!moduleLoader) {
        return null;
      }

      const module = await moduleLoader();
      const pathwayData = module.default as PathwayData;

      // Only fetch progress on client-side (browser environment)
      if (typeof window !== 'undefined') {
        try {
          // Fetch user's progress for this pathway
          const pathwayProgress = await ProgressService.fetchPathwayProgress(pathwayData.id);

          // Apply progress data to pathway
          pathwayData.progress = pathwayProgress.progress;

          // Mark modules as completed based on user progress
          pathwayData.modules.forEach(module => {
            module.completed = pathwayProgress.completedModules.includes(module.id);
          });
        } catch (error) {
          console.error(`Failed to fetch progress for pathway: ${slug}`, error);
          // Set default progress values on error
          pathwayData.progress = 0;
          pathwayData.modules.forEach(module => {
            module.completed = false;
          });
        }
      } else {
        // Server-side: set default progress values
        pathwayData.progress = 0;
        pathwayData.modules.forEach(module => {
          module.completed = false;
        });
      }

      return pathwayData;
    } catch (error) {
      console.error(`Failed to load pathway: ${slug}`, error);
      return null;
    }
  }

  /**
   * Get all available pathway slugs
   */
  static getPathwaySlugs(): string[] {
    return Object.keys(pathwayModules);
  }

  /**
   * Check if a pathway slug exists
   */
  static pathwayExists(slug: string): boolean {
    return slug in pathwayModules;
  }

  /**
   * Get pathway meta by slug
   */
  static getPathwayMetaBySlug(slug: string): PathwayMeta | null {
    return PATHWAY_META.find(p => p.slug === slug) || null;
  }
}