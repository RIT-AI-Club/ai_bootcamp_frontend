import { ACHIEVEMENTS } from './achievements-data';
import { Achievement, UserAchievementStats, AchievementProgress } from './types';
import { PathwayManager, PATHWAY_META } from '@/lib/pathways/pathway-manager';

export class AchievementManager {
  /**
   * Calculate user achievements based on their progress
   */
  static calculateUserAchievements(): Achievement[] {
    const pathwayMeta = PathwayManager.getPathwayMeta();
    const achievements = [...ACHIEVEMENTS];

    // Calculate statistics from pathway data
    const totalProgress = pathwayMeta.reduce((sum, pathway) => sum + pathway.progress, 0) / pathwayMeta.length;
    const completedPathways = pathwayMeta.filter(p => p.progress === 100);
    const startedPathways = pathwayMeta.filter(p => p.progress > 0);
    const totalModulesCompleted = Math.floor(totalProgress * 0.5); // Rough estimate based on progress

    // Update achievements based on current progress
    achievements.forEach(achievement => {
      let isUnlocked = false;

      switch (achievement.requirement.type) {
        case 'total_progress':
          isUnlocked = totalProgress >= achievement.requirement.value;
          break;
        
        case 'pathway_complete':
          if (achievement.requirement.pathwayId) {
            // Specific pathway completion
            const pathway = pathwayMeta.find(p => p.slug === achievement.requirement.pathwayId);
            isUnlocked = pathway?.progress === 100 || false;
          } else {
            // Any pathway completions
            isUnlocked = completedPathways.length >= achievement.requirement.value;
          }
          break;
        
        case 'pathways_started':
          isUnlocked = startedPathways.length >= achievement.requirement.value;
          break;
        
        case 'modules_complete':
          isUnlocked = totalModulesCompleted >= achievement.requirement.value;
          break;
        
        case 'perfect_score':
          // This would require more detailed tracking - for now, unlock based on high progress
          isUnlocked = totalProgress >= 90 && totalModulesCompleted >= achievement.requirement.value * 0.3;
          break;
        
        default:
          isUnlocked = false;
      }

      achievement.isUnlocked = isUnlocked;
      if (isUnlocked && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date();
      }
    });

    return achievements;
  }

  /**
   * Get user achievement statistics
   */
  static getUserAchievementStats(): UserAchievementStats {
    const achievements = this.calculateUserAchievements();
    const unlockedAchievements = achievements.filter(a => a.isUnlocked);
    
    return {
      totalPoints: unlockedAchievements.reduce((sum, a) => sum + a.points, 0),
      unlockedCount: unlockedAchievements.length,
      totalCount: achievements.length,
      completionPercentage: (unlockedAchievements.length / achievements.length) * 100,
      recentUnlocks: unlockedAchievements
        .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
        .slice(0, 3)
    };
  }

  /**
   * Get achievement progress for unlocked and nearly unlocked achievements
   */
  static getAchievementProgress(): AchievementProgress[] {
    const pathwayMeta = PathwayManager.getPathwayMeta();
    const achievements = this.calculateUserAchievements();
    
    // Calculate current values for different requirement types
    const totalProgress = pathwayMeta.reduce((sum, pathway) => sum + pathway.progress, 0) / pathwayMeta.length;
    const completedPathways = pathwayMeta.filter(p => p.progress === 100).length;
    const startedPathways = pathwayMeta.filter(p => p.progress > 0).length;
    const totalModulesCompleted = Math.floor(totalProgress * 0.5);

    const progress: AchievementProgress[] = [];

    achievements.forEach(achievement => {
      let currentValue = 0;
      
      switch (achievement.requirement.type) {
        case 'total_progress':
          currentValue = totalProgress;
          break;
        case 'pathway_complete':
          if (achievement.requirement.pathwayId) {
            const pathway = pathwayMeta.find(p => p.slug === achievement.requirement.pathwayId);
            currentValue = pathway?.progress === 100 ? 1 : 0;
          } else {
            currentValue = completedPathways;
          }
          break;
        case 'pathways_started':
          currentValue = startedPathways;
          break;
        case 'modules_complete':
          currentValue = totalModulesCompleted;
          break;
        case 'perfect_score':
          currentValue = Math.floor(totalModulesCompleted * 0.3); // Estimate
          break;
      }

      const percentage = Math.min((currentValue / achievement.requirement.value) * 100, 100);
      
      // Only include if there's some progress or it's unlocked
      if (percentage > 0 || achievement.isUnlocked) {
        progress.push({
          achievementId: achievement.id,
          currentValue: Math.floor(currentValue),
          targetValue: achievement.requirement.value,
          percentage: Math.floor(percentage)
        });
      }
    });

    return progress;
  }

  /**
   * Get achievements by category
   */
  static getAchievementsByCategory() {
    const achievements = this.calculateUserAchievements();
    
    return {
      progress: achievements.filter(a => a.category === 'progress'),
      completion: achievements.filter(a => a.category === 'completion'),
      exploration: achievements.filter(a => a.category === 'exploration'),
      mastery: achievements.filter(a => a.category === 'mastery'),
      streak: achievements.filter(a => a.category === 'streak')
    };
  }
}