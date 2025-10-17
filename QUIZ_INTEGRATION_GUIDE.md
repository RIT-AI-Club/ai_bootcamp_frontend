# Quiz Integration Guide

## How to Add a Quiz to Any Resource

### Step 1: Create Quiz JSON File

Create a JSON file in `/data/quizzes/` with this structure:

```json
{
  "id": "unique-quiz-id",
  "title": "Quiz Title",
  "description": "Brief description of the quiz",
  "passingScore": 70,
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "question": "Your question here?",
      "options": [
        {"id": "a", "text": "Option A", "isCorrect": false},
        {"id": "b", "text": "Option B", "isCorrect": true},
        {"id": "c", "text": "Option C", "isCorrect": false},
        {"id": "d", "text": "Option D", "isCorrect": false}
      ],
      "explanation": "Explanation of the correct answer"
    },
    {
      "id": "q2",
      "type": "true-false",
      "question": "True or false question?",
      "options": [
        {"id": "true", "text": "True", "isCorrect": true},
        {"id": "false", "text": "False", "isCorrect": false}
      ],
      "explanation": "Why this is true/false"
    }
  ]
}
```

**Example:** `/data/quizzes/foundations-image-gen-quiz.json`

### Step 2: Update Pathway JSON

In your pathway JSON file (e.g., `image-generation.json`), add the quiz resource:

```json
{
  "type": "quiz",
  "title": "Quiz: Your Quiz Title",
  "url": "/data/quizzes/your-quiz-file.json"
}
```

**Example from image-generation.json:**
```json
{
  "type": "quiz",
  "title": "Quiz: 8 MCQ on model types and use-cases",
  "url": "/data/quizzes/foundations-image-gen-quiz.json"
}
```

### Step 3: That's It!

The `ResourceItem` component will automatically:
- Show a "Start Quiz" button
- Load the quiz from the JSON file
- Display it in a modal
- Track completion when finished
- Show "Completed" status

## Quiz Features

✅ **Multiple Choice** - 2-6 options per question
✅ **True/False** - Simple binary questions
✅ **Instant Feedback** - Shows correct/incorrect with explanations
✅ **Progress Tracking** - Visual progress bar
✅ **Score Display** - Final score with pass/fail status
✅ **Retake Option** - Can retake quiz multiple times
✅ **Auto-Completion** - Marks resource as complete when quiz finished

## File Naming Convention

Use this pattern for quiz files:
- `{module-id}-quiz.json`
- Example: `foundations-image-gen-quiz.json`

## Example Quizzes Created

1. **Image Generation Quiz**: `/data/quizzes/foundations-image-gen-quiz.json`
   - 8 multiple choice questions
   - Covers model types, use cases, and technical concepts
   - Passing score: 70%

## Adding More Quizzes

For each module with a quiz:

1. **Create quiz JSON** in `/data/quizzes/`
2. **Update pathway JSON** to reference it
3. **That's it** - ResourceItem handles the rest

## Technical Details

- Quiz data loaded via `fetch()` when user clicks "Start Quiz"
- Uses existing `Quiz.tsx` component for UI
- Integrates with resource completion tracking
- Supports pathway color theming
- Mobile-responsive modal design
