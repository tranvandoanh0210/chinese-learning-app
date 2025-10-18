import { Injectable } from '@angular/core';
import { Lesson, Category } from '../models/lesson.model';
import { SAMPLE_DATA } from '../../util/data';
import { Exercise } from '../models/exercise.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private lessons: Lesson[] = SAMPLE_DATA;

  constructor() {}

  getAllLessons(): Lesson[] {
    return this.lessons;
  }
  countLessons(): number {
    return this.lessons.length;
  }
  getLessonById(id: string): Lesson | undefined {
    return this.lessons.find((lesson) => lesson.id === id);
  }

  getCategoryById(lessonId: string, categoryId: string): Category | undefined {
    const lesson = this.getLessonById(lessonId);
    return lesson?.categories.find((cat) => cat.id === categoryId);
  }

  getExerciseById(lessonId: string, categoryId: string, exerciseId: string): Exercise | undefined {
    const category = this.getCategoryById(lessonId, categoryId);
    return category?.exercises.find((ex) => ex.id === exerciseId);
  }
}
