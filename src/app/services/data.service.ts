import { Injectable } from '@angular/core';
import { Lesson, Category } from '../models/lesson.model';
import { SAMPLE_DATA } from '../../util/data';
import { Exercise } from '../models/exercise.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private lessons: Lesson[] = [];
  // private lessons: Lesson[] = SAMPLE_DATA;
  constructor() {
    // Load initial data
    this.loadInitialData();
  }
  private loadInitialData(): void {
    // Ưu tiên load từ localStorage, nếu không có thì dùng sample data
    const savedData = localStorage.getItem('chinese-learning-data');
    if (savedData) {
      try {
        const lessons = JSON.parse(savedData);
        this.lessons = lessons;
      } catch (error) {
        console.error('Error loading saved data:', error);
        this.lessons = SAMPLE_DATA;
      }
    } else {
      this.lessons = SAMPLE_DATA;
    }
  }
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
  updateLessons(lessons: Lesson[]): void {
    // Tính toán lại order cho lessons và categories
    const updatedLessons = lessons.map((lesson, index) => ({
      ...lesson,
      order: index + 1,
      categories: lesson.categories.map((category, catIndex) => ({
        ...category,
        order: catIndex + 1,
        exercises: category.exercises.map((exercise) => ({
          ...exercise,
          categoryId: category.id,
        })),
      })),
    }));

    this.lessons = updatedLessons;
    this.saveToLocalStorage(updatedLessons);
  }
  private saveToLocalStorage(lessons: Lesson[]): void {
    localStorage.setItem('chinese-learning-data', JSON.stringify(lessons));
  }
}
