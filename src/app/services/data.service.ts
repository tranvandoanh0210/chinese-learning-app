import { Injectable } from '@angular/core';
import { Lesson, Category } from '../models/lesson.model';
import { SAMPLE_DATA } from '../../util/data';
import { Exercise } from '../models/exercise.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private lessonsSubject: BehaviorSubject<Lesson[]>;
  public lessons$: Observable<Lesson[]>;
  // private lessons: Lesson[] = SAMPLE_DATA;
  constructor() {
    // Load initial data
    const initialData = this.loadInitialData();
    this.lessonsSubject = new BehaviorSubject<Lesson[]>(initialData);
    this.lessons$ = this.lessonsSubject.asObservable();
  }
  private loadInitialData(): Lesson[] {
    // Ưu tiên load từ localStorage, nếu không có thì dùng sample data
    const savedData = localStorage.getItem('chinese-learning-data');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error('Error loading saved data:', error);
        return SAMPLE_DATA;
      }
    } else {
      return SAMPLE_DATA;
    }
  }
  getAllLessons(): Lesson[] {
    return this.lessonsSubject.value;
  }
  countLessons(): number {
    return this.lessonsSubject.value.length;
  }
  getLessonById(id: string): Lesson | undefined {
    return this.lessonsSubject.value.find((lesson) => lesson.id === id);
  }
  getTotalExercisesInCategory(lessonId: string, categoryId: string): number {
    const lesson = this.getLessonById(lessonId);
    if (!lesson) return 0;

    const category = lesson.categories.find((c) => c.id === categoryId);
    return category ? category.exercises.length : 0;
  }

  getTotalCategoriesInLesson(lessonId: string): number {
    const lesson = this.getLessonById(lessonId);
    return lesson ? lesson.categories.length : 0;
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

    this.lessonsSubject.next(updatedLessons);
    this.saveToLocalStorage(updatedLessons);
  }
  private saveToLocalStorage(lessons: Lesson[]): void {
    localStorage.setItem('chinese-learning-data', JSON.stringify(lessons));
  }
  // Thêm method để refresh data từ localStorage (nếu cần)
  refreshFromStorage(): void {
    const data = this.loadInitialData();
    this.lessonsSubject.next(data);
  }

  // Thêm method để thêm lesson mới (nếu cần)
  addLesson(lesson: Lesson): void {
    const currentLessons = this.lessonsSubject.value;
    const updatedLessons = [...currentLessons, lesson];
    this.updateLessons(updatedLessons);
  }

  // Thêm method để xóa lesson (nếu cần)
  deleteLesson(lessonId: string): void {
    const currentLessons = this.lessonsSubject.value;
    const updatedLessons = currentLessons.filter((lesson) => lesson.id !== lessonId);
    this.updateLessons(updatedLessons);
  }

  getTotalCategoriesStats(): number {
    const lessons = this.getAllLessons();
    return lessons.reduce((total, lesson) => total + lesson.categories.length, 0);
  }

  getTotalExercisesStats(): number {
    const lessons = this.getAllLessons();
    return lessons.reduce(
      (total, lesson) =>
        total +
        lesson.categories.reduce((catTotal, category) => catTotal + category.exercises.length, 0),
      0
    );
  }

  getExerciseTypesCount(): number {
    const lessons = this.getAllLessons();
    const types = new Set<string>();

    lessons.forEach((lesson) => {
      lesson.categories.forEach((category) => {
        category.exercises.forEach((exercise) => {
          types.add(exercise.type);
        });
      });
    });

    return types.size;
  }
}
