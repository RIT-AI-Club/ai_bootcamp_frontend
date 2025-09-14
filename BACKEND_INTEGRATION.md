# Backend Integration Requirements

This document outlines the API endpoints and database changes needed to support user progress tracking in the AI Bootcamp frontend.

## Database Schema Requirements

The backend will need to store and track user progress data. Here are the recommended tables:

### 1. User Progress Table
```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pathway_id VARCHAR(50) NOT NULL,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  current_module_id VARCHAR(50),
  last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, pathway_id)
);
```

### 2. Module Completions Table
```sql
CREATE TABLE module_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pathway_id VARCHAR(50) NOT NULL,
  module_id VARCHAR(50) NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  score INTEGER, -- Optional: for tracking module scores
  UNIQUE(user_id, pathway_id, module_id)
);
```

### 3. User Achievements Table
```sql
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id VARCHAR(50) NOT NULL,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, achievement_id)
);
```

## Required API Endpoints

### Progress Endpoints

#### GET /api/v1/users/me/progress
Returns the user's overall progress across all pathways.

**Response:**
```json
{
  "userId": "uuid",
  "pathwayProgress": {
    "computer-vision": {
      "progress": 75,
      "completedModules": ["cv-basics", "feature-detection", "cnn-basics"],
      "currentModule": "object-detection",
      "lastAccessed": "2025-01-15T10:30:00Z"
    },
    "reinforcement-learning": {
      "progress": 25,
      "completedModules": ["rl-intro"],
      "currentModule": "mdp-basics",
      "lastAccessed": "2025-01-12T14:20:00Z"
    }
  },
  "totalProgress": 35,
  "modulesCompleted": 4,
  "pathwaysStarted": 2,
  "pathwaysCompleted": 0
}
```

#### GET /api/v1/users/me/progress/{pathway_id}
Returns progress for a specific pathway.

**Response:**
```json
{
  "pathwayId": "computer-vision",
  "progress": 75,
  "completedModules": ["cv-basics", "feature-detection", "cnn-basics"],
  "currentModule": "object-detection",
  "lastAccessed": "2025-01-15T10:30:00Z"
}
```

#### POST /api/v1/users/me/progress/{pathway_id}/modules/{module_id}/complete
Marks a module as completed.

**Request Body:**
```json
{
  "score": 95  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "newProgress": 50,
  "unlockedAchievements": ["first-steps", "getting-started"]
}
```

#### PUT /api/v1/users/me/progress/{pathway_id}
Updates pathway progress percentage.

**Request Body:**
```json
{
  "progress": 85,
  "currentModule": "image-segmentation"
}
```

### Achievement Endpoints

#### GET /api/v1/users/me/achievements
Returns user's achievement data.

**Response:**
```json
{
  "unlockedAchievements": [
    {
      "id": "first-steps",
      "unlockedAt": "2025-01-10T09:00:00Z"
    }
  ],
  "totalPoints": 35,
  "unlockedCount": 3,
  "totalCount": 25,
  "completionPercentage": 12
}
```

#### GET /api/v1/users/me/achievements/progress
Returns progress toward unlockable achievements.

**Response:**
```json
[
  {
    "achievementId": "getting-started",
    "currentValue": 8,
    "targetValue": 10,
    "percentage": 80
  }
]
```

## Frontend Service Files

The following service files have been created to handle backend integration:

### `/lib/progress/progress-service.ts`
- Contains placeholder methods for all progress-related API calls
- Methods return empty/zero values until backend is implemented
- All methods are properly typed and documented

### Updated Files
- `/lib/pathways/pathway-manager.ts` - Now uses ProgressService
- `/lib/achievements/achievement-manager.ts` - Now uses ProgressService
- All pathway JSON files - Removed hardcoded `completed: true` values

## Implementation Steps

1. **Backend Database Setup**
   - Create the three tables listed above
   - Add appropriate indexes for performance
   - Set up foreign key constraints

2. **Backend API Implementation**
   - Implement all progress endpoints
   - Implement achievement calculation logic
   - Add proper authentication middleware
   - Add validation for progress values (0-100%)

3. **Frontend Integration**
   - Update `ProgressService` methods to make actual API calls
   - Add error handling and loading states to components
   - Test with real backend data

4. **Achievement Logic**
   - Implement achievement unlock detection in backend
   - Add real-time achievement notifications
   - Store achievement unlock timestamps

## Current State

- ✅ Removed all hardcoded progress data from frontend
- ✅ Created service layer for backend integration
- ✅ Updated components to use service methods
- ✅ All progress values now default to 0
- ⏳ Backend API implementation needed
- ⏳ Database schema implementation needed
- ⏳ Frontend service methods need real API calls

## Testing

Once the backend is implemented, test the following flows:

1. **New User Flow**
   - All pathways show 0% progress
   - No achievements unlocked
   - No completed modules

2. **Progress Update Flow**
   - Mark module as complete
   - Verify progress percentage updates
   - Check achievement unlocks

3. **Data Persistence**
   - Progress persists across sessions
   - Achievement unlocks are permanent
   - Module completions are tracked

The frontend is now fully prepared for backend integration with no hardcoded progress data remaining.