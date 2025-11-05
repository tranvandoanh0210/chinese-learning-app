import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Lesson, Category } from '../models/lesson.model';
import {
  DialogueExercise,
  Exercise,
  FlashcardExercise,
  GrammarExercise,
  InputExercise,
  MultipleChoiceExercise,
  SpeakingExercise,
  VocabularyExercise,
  WritingExercise,
} from '../models/exercise.model';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private selectedLessonSubject = new BehaviorSubject<Lesson | null>(null);
  public selectedLesson$ = this.selectedLessonSubject.asObservable();

  constructor(private dataService: DataService) {}

  // Lesson CRUD
  createLesson(lessonData: Partial<Lesson>): Lesson {
    const lessons = this.dataService.getAllLessons();
    const newLesson: Lesson = {
      id: this.generateId('lesson'),
      name_zh: lessonData.name_zh,
      name_vi: lessonData.name_vi || '',
      description: lessonData.description,
      order: lessons.length + 1,
      categories: [],
    };

    const updatedLessons = [...lessons, newLesson];
    this.dataService.updateLessons(updatedLessons);
    return newLesson;
  }

  updateLesson(lessonId: string, updates: Partial<Lesson>): void {
    const lessons = this.dataService.getAllLessons();
    const updatedLessons = lessons.map((lesson) =>
      lesson.id === lessonId ? { ...lesson, ...updates } : lesson
    );
    this.dataService.updateLessons(updatedLessons);
  }

  deleteLesson(lessonId: string): void {
    const lessons = this.dataService.getAllLessons();
    const updatedLessons = lessons.filter((lesson) => lesson.id !== lessonId);
    this.dataService.updateLessons(updatedLessons);
  }

  // Category CRUD
  addCategory(lessonId: string, categoryData: Partial<Category>): void {
    const lessons = this.dataService.getAllLessons();
    const updatedLessons = lessons.map((lesson) => {
      if (lesson.id === lessonId) {
        const newCategory: Category = {
          id: this.generateId('category'),
          lessonId: lessonId,
          type: categoryData.type!,
          name: categoryData.name || this.getDefaultCategoryName(categoryData.type!),
          description: categoryData.description,
          order: lesson.categories.length + 1,
          exercises: [],
        };
        return {
          ...lesson,
          categories: [...lesson.categories, newCategory],
        };
      }
      return lesson;
    });
    this.dataService.updateLessons(updatedLessons);
  }

  updateCategory(lessonId: string, categoryId: string, updates: Partial<Category>): void {
    const lessons = this.dataService.getAllLessons();
    const updatedLessons = lessons.map((lesson) => {
      if (lesson.id === lessonId) {
        return {
          ...lesson,
          categories: lesson.categories.map((cat) =>
            cat.id === categoryId ? { ...cat, ...updates } : cat
          ),
        };
      }
      return lesson;
    });
    this.dataService.updateLessons(updatedLessons);
  }

  deleteCategory(lessonId: string, categoryId: string): void {
    const lessons = this.dataService.getAllLessons();
    const updatedLessons = lessons.map((lesson) => {
      if (lesson.id === lessonId) {
        return {
          ...lesson,
          categories: lesson.categories.filter((cat) => cat.id !== categoryId),
        };
      }
      return lesson;
    });
    this.dataService.updateLessons(updatedLessons);
  }

  // Exercise CRUD
  addExercise(lessonId: string, categoryId: string, exercise: Exercise): void {
    const lessons = this.dataService.getAllLessons();
    const updatedLessons = lessons.map((lesson) => {
      if (lesson.id === lessonId) {
        return {
          ...lesson,
          categories: lesson.categories.map((cat) => {
            if (cat.id === categoryId) {
              const exerciseWithId = {
                ...exercise,
                id: this.generateId('ex'),
                categoryId: categoryId,
              };
              return {
                ...cat,
                exercises: [...cat.exercises, exerciseWithId],
              };
            }
            return cat;
          }),
        };
      }
      return lesson;
    });
    this.dataService.updateLessons(updatedLessons);
  }
  updateExercise(
    lessonId: string,
    categoryId: string,
    exerciseId: string,
    updates: Partial<Exercise>
  ): void {
    const lessons = this.dataService.getAllLessons();
    const updatedLessons = lessons.map((lesson) => {
      if (lesson.id === lessonId) {
        return {
          ...lesson,
          categories: lesson.categories.map((cat) => {
            if (cat.id === categoryId) {
              return {
                ...cat,
                exercises: cat.exercises.map((ex) => {
                  if (ex.id === exerciseId) {
                    // Tạo object mới với type safety
                    const updatedExercise = { ...ex, ...updates };

                    // Đảm bảo type consistency bằng cách xử lý từng loại exercise
                    return this.ensureExerciseTypeConsistency(updatedExercise, ex.type);
                  }
                  return ex;
                }),
              };
            }
            return cat;
          }),
        };
      }
      return lesson;
    });
    this.dataService.updateLessons(updatedLessons);
  }

  // Helper method để đảm bảo type consistency
  private ensureExerciseTypeConsistency(exercise: any, originalType: string): Exercise {
    // Dựa vào original type để đảm bảo các field đúng với type
    switch (originalType) {
      case 'vocabulary':
        return {
          id: exercise.id,
          categoryId: exercise.categoryId,
          type: 'vocabulary',
          question: exercise.question || '',
          answer: exercise.answer || '',
          explanation: exercise.explanation || '',
          pinyin: exercise.pinyin || '',
        } as VocabularyExercise;

      case 'grammar':
        return {
          id: exercise.id,
          categoryId: exercise.categoryId,
          type: 'grammar',
          question: exercise.question || '',
          answer: exercise.answer || '',
          explanation: exercise.explanation || '',
          content: exercise.content || '',
          examples: exercise.examples || [],
        } as GrammarExercise;

      case 'multiple_choice':
        return {
          id: exercise.id,
          categoryId: exercise.categoryId,
          type: 'multiple_choice',
          question: exercise.question || '',
          answer: exercise.answer || '',
          explanation: exercise.explanation || '',
          options: exercise.options || [],
        } as MultipleChoiceExercise;

      case 'input':
        return {
          id: exercise.id,
          categoryId: exercise.categoryId,
          type: 'input',
          question: exercise.question || '',
          answer: exercise.answer || '',
          explanation: exercise.explanation || '',
          placeholder: exercise.placeholder || '',
        } as InputExercise;

      case 'speaking':
        return {
          id: exercise.id,
          categoryId: exercise.categoryId,
          type: 'speaking',
          question: exercise.question || '',
          answer: exercise.answer || '',
          explanation: exercise.explanation || '',
          pinyin: exercise.pinyin || '',
        } as SpeakingExercise;

      case 'flashcard':
        return {
          id: exercise.id,
          categoryId: exercise.categoryId,
          type: 'flashcard',
          question: exercise.question || '',
          answer: exercise.answer || '',
          explanation: exercise.explanation || '',
          pinyin: exercise.pinyin || '',
        } as FlashcardExercise;

      case 'dialogue':
        return {
          id: exercise.id,
          categoryId: exercise.categoryId,
          type: 'dialogue',
          question: exercise.question || '',
          answer: exercise.answer || '',
          explanation: exercise.explanation || '',
          context: exercise.context || '',
          lines: exercise.lines || [],
        } as DialogueExercise;

      case 'writing':
        return {
          id: exercise.id,
          categoryId: exercise.categoryId,
          type: 'writing',
          question: exercise.question || '',
          answer: exercise.answer || '',
          explanation: exercise.explanation || '',
          pinyin: exercise.pinyin || '',
        } as WritingExercise;

      default:
        // Fallback - giữ nguyên type gốc
        return {
          ...exercise,
          type: originalType,
        } as Exercise;
    }
  }

  deleteExercise(lessonId: string, categoryId: string, exerciseId: string): void {
    const lessons = this.dataService.getAllLessons();
    const updatedLessons = lessons.map((lesson) => {
      if (lesson.id === lessonId) {
        return {
          ...lesson,
          categories: lesson.categories.map((cat) => {
            if (cat.id === categoryId) {
              return {
                ...cat,
                exercises: cat.exercises.filter((ex) => ex.id !== exerciseId),
              };
            }
            return cat;
          }),
        };
      }
      return lesson;
    });
    this.dataService.updateLessons(updatedLessons);
  }

  // Selection management
  setSelectedLesson(lesson: Lesson | null): void {
    this.selectedLessonSubject.next(lesson);
  }

  // Helper methods
  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDefaultCategoryName(type: string): string {
    const nameMap: { [key: string]: string } = {
      vocabulary: 'Từ vựng',
      grammar: 'Ngữ pháp',
      dialogue: 'Hội thoại',
      writing: 'Luyện viết',
      test: 'Kiểm tra',
      review: 'Ôn tập',
      speaking: 'Luyện nói',
    };
    return nameMap[type] || type;
  }
}
