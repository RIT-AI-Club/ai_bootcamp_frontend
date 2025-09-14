import { ACHIEVEMENTS } from './achievements-data';
import { Achievement, UserAchievementStats, AchievementProgress } from './types';
import { ProgressService } from '@/lib/progress/progress-service';

export class AchievementManager {
  /**
   * Calculate user achievements based on their progress from backend
   */
  static async calculateUserAchievements(): Promise<Achievement[]> {
    const achievements = [...ACHIEVEMENTS];

    try {
      const userProgress = await ProgressService.fetchUserProgress();

      // Calculate unlocks based on actual user progress
      achievements.forEach(achievement => {
        let isUnlocked = false;

        switch (achievement.requirement.type) {
          case 'total_progress':
            isUnlocked = userProgress.totalProgress >= achievement.requirement.value;
            break;

          case 'pathway_complete':
            if (achievement.requirement.pathwayId) {
              // Specific pathway completion
              const pathwayProgress = userProgress.pathwayProgress[achievement.requirement.pathwayId];
              isUnlocked = pathwayProgress?.progress === 100 || false;
            } else {
              // Any pathway completions
              isUnlocked = userProgress.pathwaysCompleted >= achievement.requirement.value;
            }
            break;

          case 'pathways_started':
            isUnlocked = userProgress.pathwaysStarted >= achievement.requirement.value;
            break;

          case 'modules_complete':
            isUnlocked = userProgress.modulesCompleted >= achievement.requirement.value;
            break;

          case 'perfect_score':
            // TODO: Implement perfect score tracking in backend
            isUnlocked = false;
            break;

          default:
            isUnlocked = false;
        }

        achievement.isUnlocked = isUnlocked;
        if (isUnlocked && !achievement.unlockedAt) {
          achievement.unlockedAt = new Date();
        }
      });
    } catch (error) {
      console.error('Failed to calculate achievements:', error);
      // Keep all achievements locked on error
      achievements.forEach(achievement => {
        achievement.isUnlocked = false;
        achievement.unlockedAt = undefined;
      });
    }

    return achievements;
  }

  /**
   * Get user achievement statistics
   */
  static async getUserAchievementStats(): Promise<UserAchievementStats> {
    const achievements = await this.calculateUserAchievements();
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
  static async getAchievementProgress(): Promise<AchievementProgress[]> {
    try {
      const achievements = await this.calculateUserAchievements();
      const userProgress = await ProgressService.fetchUserProgress();
      const progress: AchievementProgress[] = [];

      achievements.forEach(achievement => {
        let currentValue = 0;

        switch (achievement.requirement.type) {
          case 'total_progress':
            currentValue = userProgress.totalProgress;
            break;
          case 'pathway_complete':
            if (achievement.requirement.pathwayId) {
              const pathwayProgress = userProgress.pathwayProgress[achievement.requirement.pathwayId];
              currentValue = pathwayProgress?.progress === 100 ? 1 : 0;
            } else {
              currentValue = userProgress.pathwaysCompleted;
            }
            break;
          case 'pathways_started':
            currentValue = userProgress.pathwaysStarted;
            break;
          case 'modules_complete':
            currentValue = userProgress.modulesCompleted;
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
    } catch (error) {
      console.error('Failed to get achievement progress:', error);
      return [];
    }
  }

  /**
   * Get achievements by category
   */
  static async getAchievementsByCategory() {
    const achievements = await this.calculateUserAchievements();

    return {
      progress: achievements.filter(a => a.category === 'progress'),
      completion: achievements.filter(a => a.category === 'completion'),
      exploration: achievements.filter(a => a.category === 'exploration'),
      mastery: achievements.filter(a => a.category === 'mastery'),
      streak: achievements.filter(a => a.category === 'streak')
    };
  }
}