export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'progress' | 'completion' | 'streak' | 'mastery' | 'exploration';
  requirement: {
    type: 'pathway_complete' | 'total_progress' | 'modules_complete' | 'pathways_started' | 'perfect_score' | 'time_spent';
    value: number;
    pathwayId?: string;
  };
  unlockedAt?: Date;
  isUnlocked: boolean;
  points: number;
}

export interface AchievementProgress {
  achievementId: string;
  currentValue: number;
  targetValue: number;
  percentage: number;
}

export interface UserAchievementStats {
  totalPoints: number;
  unlockedCount: number;
  totalCount: number;
  completionPercentage: number;
  recentUnlocks: Achievement[];
}