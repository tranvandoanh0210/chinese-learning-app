import { Exercise } from './exercise.model';

export interface Lesson {
  id: string;
  name_zh?: string;
  name_vi: string;
  description?: string;
  order: number;
  categories: Category[];
}

export interface Category {
  id: string;
  lessonId: string;
  type: 'vocabulary' | 'grammar' | 'speaking' | 'test' | 'review' | 'writing' | 'dialogue';
  name: string;
  description?: string;
  order: number;
  exercises: Exercise[];
}
