import { DataService } from './data.service';
// progress.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  UserProgress,
  ExerciseCompletionEvent,
  CategoryProgress,
  LessonProgress,
  ExerciseProgress,
} from '../models/progress.model';
import { Lesson } from '../models/lesson.model';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private readonly STORAGE_KEY = 'chinese-learning-progress';
  private progressSubject = new BehaviorSubject<UserProgress | null>(this.loadProgress());

  constructor(private dataService: DataService) {}

  // Load progress from localStorage
  private loadProgress(): UserProgress {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }

    // Initialize new progress
    return {
      userId: this.generateUserId(),
      lessons: [],
      lastUpdated: new Date(),
    };
  }

  // Save progress to localStorage
  private saveProgress(progress: UserProgress): void {
    progress.lastUpdated = new Date();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    this.progressSubject.next(progress);
  }

  private generateUserId(): string {
    let userId = localStorage.getItem('chinese-learning-user-id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('chinese-learning-user-id', userId);
    }
    return userId;
  }

  // Mark exercise as completed
  markExerciseCompleted(event: ExerciseCompletionEvent): void {
    const progress = this.loadProgress();

    // Find or create lesson progress
    let lessonProgress = progress.lessons.find((l) => l.lessonId === event.lessonId);
    if (!lessonProgress) {
      lessonProgress = {
        lessonId: event.lessonId,
        categories: [],
        completed: false,
      };
      progress.lessons.push(lessonProgress);
    }

    // Find or create category progress
    let categoryProgress = lessonProgress.categories.find((c) => c.categoryId === event.categoryId);
    if (!categoryProgress) {
      categoryProgress = {
        categoryId: event.categoryId,
        type: event.exerciseType as any,
        completed: false,
        exercises: [],
        progressPercentage: 0,
      };
      lessonProgress.categories.push(categoryProgress);
    }

    // Find or create exercise progress
    let exerciseProgress = categoryProgress.exercises.find(
      (e) => e.exerciseId === event.exerciseId
    );

    if (!exerciseProgress) {
      exerciseProgress = {
        exerciseId: event.exerciseId,
        completed: event.completed,
        completionDate: event.completed ? new Date() : undefined,
        score: event.score,
        attempts: 1,
        data: event.data,
      };
      categoryProgress.exercises.push(exerciseProgress);
    } else {
      exerciseProgress.completed = event.completed;
      exerciseProgress.completionDate = event.completed ? new Date() : undefined;
      exerciseProgress.score = event.score;
      exerciseProgress.attempts = (exerciseProgress.attempts || 0) + 1;
      exerciseProgress.data = event.data;
    }

    // Update category progress percentage
    this.updateCategoryProgress(categoryProgress, event.categoryId, event.lessonId);

    // Update lesson completion status
    this.updateLessonCompletion(lessonProgress, event.lessonId);

    this.saveProgress(progress);
  }

  private updateCategoryProgress(
    categoryProgress: CategoryProgress,
    categoryId: string,
    lessonId: string
  ): void {
    const totalExercises = this.getTotalExercisesInCategory(lessonId, categoryId);
    const completedExercises = categoryProgress.exercises.filter((e) => e.completed).length;
    categoryProgress.progressPercentage =
      totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

    // Chỉ đánh dấu hoàn thành khi hoàn thành TẤT CẢ exercises
    categoryProgress.completed = completedExercises === totalExercises && totalExercises > 0;
  }

  private updateLessonCompletion(lessonProgress: LessonProgress, lessonId: string): void {
    const totalCategories = this.getTotalCategoriesInLesson(lessonId);
    const completedCategories = lessonProgress.categories.filter((c) => c.completed).length;
    lessonProgress.completed = completedCategories === totalCategories && totalCategories > 0;

    if (lessonProgress.completed && !lessonProgress.completionDate) {
      lessonProgress.completionDate = new Date();
    }
  }
  private getTotalExercisesInCategory(lessonId: string, categoryId: string): number {
    return this.dataService.getTotalExercisesInCategory(lessonId, categoryId);
  }
  private getTotalCategoriesInLesson(lessonId: string): number {
    return this.dataService.getTotalCategoriesInLesson(lessonId);
  }

  getTotalExercises(lesson: Lesson): number {
    return lesson.categories.reduce((total, category) => total + category.exercises.length, 0) || 0;
  }
  // Get progress for a specific lesson
  getLessonProgress(lessonId: string): LessonProgress | null {
    const progress = this.loadProgress();
    return progress.lessons.find((l) => l.lessonId === lessonId) || null;
  }

  // Get progress for a specific category
  getCategoryProgress(lessonId: string, categoryId: string): CategoryProgress | null {
    const lessonProgress = this.getLessonProgress(lessonId);
    return lessonProgress?.categories.find((c) => c.categoryId === categoryId) || null;
  }

  // Get progress for a specific exercise
  getExerciseProgress(
    lessonId: string,
    categoryId: string,
    exerciseId: string
  ): ExerciseProgress | null {
    const categoryProgress = this.getCategoryProgress(lessonId, categoryId);
    return categoryProgress?.exercises.find((e) => e.exerciseId === exerciseId) || null;
  }

  // Check if exercise is completed
  isExerciseCompleted(lessonId: string, categoryId: string, exerciseId: string): boolean {
    const exerciseProgress = this.getExerciseProgress(lessonId, categoryId, exerciseId);
    return exerciseProgress?.completed || false;
  }

  // Get overall progress
  getOverallProgress(): UserProgress {
    return this.loadProgress();
  }

  // Get progress observable
  getProgressObservable(): Observable<UserProgress | null> {
    return this.progressSubject.asObservable();
  }

  // Reset progress (for testing)
  resetProgress(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem('chinese-learning-user-id');
    this.progressSubject.next(this.loadProgress());
  }
}
