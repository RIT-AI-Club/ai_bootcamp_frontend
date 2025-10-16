# Quiz Component Usage Guide

## Overview
The Quiz component is a fully-featured, reusable quiz system with beautiful UX that matches the AI Bootcamp design system.

## Features
✅ Multiple choice questions
✅ True/False questions
✅ Progress tracking
✅ Instant feedback with explanations
✅ Score calculation with pass/fail
✅ Animated transitions
✅ Retake functionality
✅ Custom accent colors
✅ Fully responsive
✅ JSON-configurable

## Basic Usage

```tsx
'use client';

import Quiz, { QuizData } from '@/components/Quiz';
import quizData from '@/data/quizzes/example-quiz.json';

export default function QuizPage() {
  const handleQuizComplete = (score: number, passed: boolean) => {
    console.log(`Quiz completed! Score: ${score}%, Passed: ${passed}`);
    // You can save progress here, show achievement, etc.
  };

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-neutral-800/20 to-neutral-600/10" />
      </div>

      <div className="relative z-10 min-h-screen py-12 px-4">
        <Quiz
          quizData={quizData as QuizData}
          onComplete={handleQuizComplete}
          accentColor="from-yellow-500 to-orange-600" // Optional: matches pathway colors
        />
      </div>
    </div>
  );
}
```

## JSON Structure

```json
{
  "title": "Quiz Title",
  "description": "Optional description of the quiz",
  "passingScore": 70,
  "questions": [
    {
      "id": "unique-question-id",
      "type": "multiple-choice",
      "question": "What is the question text?",
      "options": [
        {
          "id": "a",
          "text": "Option A",
          "isCorrect": false
        },
        {
          "id": "b",
          "text": "Option B",
          "isCorrect": true
        }
      ],
      "explanation": "Optional explanation shown after answering"
    }
  ]
}
```

### Question Types

1. **Multiple Choice**
   - `type: "multiple-choice"`
   - Can have 2+ options
   - Only one correct answer

2. **True/False**
   - `type: "true-false"`
   - Exactly 2 options (True/False)
   - One correct answer

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `quizData` | `QuizData` | Yes | - | Quiz configuration object |
| `onComplete` | `(score: number, passed: boolean) => void` | No | - | Callback when quiz is finished |
| `accentColor` | `string` | No | `"from-blue-500 to-cyan-500"` | Tailwind gradient classes |

## Example: Multiple Choice Question

```json
{
  "id": "mc1",
  "type": "multiple-choice",
  "question": "Which framework is this built with?",
  "options": [
    {
      "id": "a",
      "text": "Vue.js",
      "isCorrect": false
    },
    {
      "id": "b",
      "text": "Next.js",
      "isCorrect": true
    },
    {
      "id": "c",
      "text": "Angular",
      "isCorrect": false
    },
    {
      "id": "d",
      "text": "Svelte",
      "isCorrect": false
    }
  ],
  "explanation": "This platform is built with Next.js 15 and React 19."
}
```

## Example: True/False Question

```json
{
  "id": "tf1",
  "type": "true-false",
  "question": "AI models can learn from few-shot examples.",
  "options": [
    {
      "id": "true",
      "text": "True",
      "isCorrect": true
    },
    {
      "id": "false",
      "text": "False",
      "isCorrect": false
    }
  ],
  "explanation": "Modern LLMs excel at few-shot learning, adapting to new tasks with just a few examples."
}
```

## Customization

### Accent Colors
Match the quiz color to your pathway:

```tsx
// Prompt Engineering pathway
<Quiz quizData={data} accentColor="from-yellow-500 to-orange-600" />

// Image Generation pathway
<Quiz quizData={data} accentColor="from-rose-500 to-red-500" />

// Computer Vision pathway
<Quiz quizData={data} accentColor="from-blue-500 to-cyan-500" />
```

### Passing Score
Set the minimum percentage needed to pass:

```json
{
  "passingScore": 80,  // 80% required to pass
  "questions": [...]
}
```

## Complete Example Page

Create a new page at `app/quiz/example/page.tsx`:

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Quiz, { QuizData } from '@/components/Quiz';
import BetaBadge from '@/components/BetaBadge';
import exampleQuiz from '@/data/quizzes/example-quiz.json';

export default function ExampleQuizPage() {
  const router = useRouter();

  const handleQuizComplete = (score: number, passed: boolean) => {
    console.log(`Score: ${score}%, Passed: ${passed}`);

    // Optional: Save to backend
    // await ProgressService.saveQuizScore('example-quiz', score);

    // Optional: Show achievement modal
    // if (passed) showAchievementModal();
  };

  return (
    <div className="min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-neutral-800/20 to-neutral-600/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="p-6 md:p-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-100/90 hover:text-gray-100/60 transition-colors duration-200 font-semibold tracking-wider"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            BACK
          </button>
        </div>

        {/* Quiz */}
        <div className="py-8 px-4">
          <Quiz
            quizData={exampleQuiz as QuizData}
            onComplete={handleQuizComplete}
            accentColor="from-yellow-500 to-orange-600"
          />
        </div>
      </div>

      {/* Beta Badge */}
      <BetaBadge />
    </div>
  );
}
```

## Integration with Modules

You can add quizzes to module resources in your pathway JSON:

```json
{
  "resources": [
    {
      "type": "exercise",
      "title": "Knowledge Check Quiz",
      "url": "/quiz/prompt-engineering-basics",
      "duration": "10 min"
    }
  ]
}
```

## TypeScript Types

```typescript
export type QuestionType = 'multiple-choice' | 'true-false';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: QuizOption[];
  explanation?: string;
}

export interface QuizData {
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore?: number; // Default: 70
}
```

## Features Breakdown

### ✨ User Experience
- Smooth page transitions between questions
- Immediate visual feedback on answer selection
- Color-coded correct/incorrect states
- Circular progress indicator on completion
- Previous/Next navigation
- Disabled states prevent accidental clicks

### 📊 Progress Tracking
- Visual progress bar
- Question counter
- Percentage completion
- Final score breakdown
- Correct/Wrong/Answered stats

### 🎨 Visual Design
- Matches AI Bootcamp design system
- Responsive on all screen sizes
- Backdrop blur effects
- Gradient accents
- Smooth animations
- Accessible color contrast

### 🔄 Retake Functionality
- One-click quiz reset
- Preserves quiz configuration
- Fresh start with clean state

## See Also
- Example quiz: `/data/quizzes/example-quiz.json`
- Component: `/components/Quiz.tsx`
- Pathway integration: Add quiz URLs to module resources
