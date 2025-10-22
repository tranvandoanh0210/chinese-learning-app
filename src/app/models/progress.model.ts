export interface UserProgress {
  userId: string;
  lessons: LessonProgress[];
  lastUpdated: Date;
}

export interface LessonProgress {
  lessonId: string;
  categories: CategoryProgress[];
  completed: boolean;
  completionDate?: Date;
}

export interface CategoryProgress {
  categoryId: string;
  type: 'vocabulary' | 'grammar' | 'speaking' | 'test' | 'review' | 'writing' | 'dialogue';
  completed: boolean;
  completionDate?: Date;
  exercises: ExerciseProgress[];
  progressPercentage: number;
}

export interface ExerciseProgress {
  exerciseId: string;
  completed: boolean;
  completionDate?: Date;
  score?: number; // For test exercises
  attempts?: number; // Number of attempts
  data?: any; // Additional data like drawing data for writing, etc.
}

export interface ExerciseCompletionEvent {
  lessonId: string;
  categoryId: string;
  exerciseId: string;
  exerciseType: string;
  completed: boolean;
  score?: number;
  data?: any;
}
