export interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  resources?: {
    type: 'video' | 'article' | 'exercise' | 'project';
    title: string;
    url?: string;
    duration?: string;
  }[];
  completed?: boolean;
  completed_at?: string;
  approval_status?: 'pending' | 'approved' | 'rejected';
  review_comments?: string;
  isAvailable?: boolean; // For marking modules as "coming soon"
}

export interface PathwayData {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  instructor: string;
  description: string;
  overview: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all levels';
  prerequisites: string[];
  learningOutcomes: string[];
  tools: string[];
  modules: Module[];
  color: string;
  icon?: string;
  tags: string[];
  enrolledCount?: number;
  rating?: number;
  lastUpdated: string;
  progress?: number;
  isAvailable?: boolean;
}

export interface PathwayMeta {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  instructor: string;
  color: string;
  progress: number;
  isAvailable?: boolean;
}