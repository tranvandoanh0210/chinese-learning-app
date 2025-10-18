// Base Exercise Interface
export interface BaseExercise {
  id: string;
  categoryId: string;
  type: string;
  question: string;
  description?: string;
  answer: string;
  explanation?: string;
}

// Vocabulary Exercise
export interface VocabularyExercise extends BaseExercise {
  type: 'vocabulary';
  pinyin: string;
  audio_url?: string;
}

// Grammar Exercise
export interface GrammarExercise extends BaseExercise {
  type: 'grammar';
  content: string;
  examples?: string[];
  difficulty: string;
}

// Multiple Choice Exercise
export interface MultipleChoiceExercise extends BaseExercise {
  type: 'multiple_choice';
  options: string[];
}

// Input Exercise
export interface InputExercise extends BaseExercise {
  type: 'input';
  placeholder?: string;
}

// Speaking Exercise
export interface SpeakingExercise extends BaseExercise {
  type: 'speaking';
  pinyin: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  sample_audio?: string;
}

// Flashcard Exercise
export interface FlashcardExercise extends BaseExercise {
  type: 'flashcard';
  pinyin: string;
  audio_url?: string;
}

// Union type for all exercises
export type Exercise =
  | VocabularyExercise
  | GrammarExercise
  | MultipleChoiceExercise
  | InputExercise
  | SpeakingExercise
  | FlashcardExercise;

// Type guard functions
export function isVocabularyExercise(exercise: Exercise): exercise is VocabularyExercise {
  return exercise.type === 'vocabulary';
}

export function isGrammarExercise(exercise: Exercise): exercise is GrammarExercise {
  return exercise.type === 'grammar';
}

export function isMultipleChoiceExercise(exercise: Exercise): exercise is MultipleChoiceExercise {
  return exercise.type === 'multiple_choice';
}

export function isInputExercise(exercise: Exercise): exercise is InputExercise {
  return exercise.type === 'input';
}

export function isFlashcardExercise(exercise: Exercise): exercise is FlashcardExercise {
  return exercise.type === 'flashcard';
}
export function isSpeakingExercise(exercise: Exercise): exercise is SpeakingExercise {
  return exercise.type === 'speaking';
}
