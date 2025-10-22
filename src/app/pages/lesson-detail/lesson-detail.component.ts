import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Lesson, Category } from '../../models/lesson.model';
import { DataService } from '../../services/data.service';
import { ExerciseDisplayComponent } from '../../components/exercise/exercise-display/exercise-display.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ProgressService } from '../../services/progress.service';
import { ExerciseCompletionEvent } from '../../models/progress.model';

@Component({
  selector: 'app-lesson-detail',
  templateUrl: './lesson-detail.component.html',
  styleUrls: ['./lesson-detail.component.css'],
  imports: [ExerciseDisplayComponent, CommonModule, RouterModule],
  standalone: true,
})
export class LessonDetailComponent implements OnInit, OnDestroy {
  private routeSub!: Subscription;
  private progressSub!: Subscription;
  lesson?: Lesson;
  selectedCategory?: Category;
  lessonProgress: any = null;
  categoryProgress: { [key: string]: any } = {};
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private progressService: ProgressService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.loadLesson(params['id']);
    });
    this.progressSub = this.progressService.getProgressObservable().subscribe(() => {
      this.updateProgressData();
    });
  }
  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.progressSub) {
      this.progressSub.unsubscribe();
    }
  }
  private loadLesson(lessonId: string): void {
    const lesson = this.dataService.getLessonById(lessonId);

    if (lesson) {
      this.lesson = lesson;
      // Reset selected category when lesson changes
      this.selectedCategory = undefined;
      this.updateProgressData();
    } else {
      // Lesson not found, redirect to home
      this.router.navigate(['/']);
    }
  }
  private updateProgressData(): void {
    if (!this.lesson) return;

    // Load lesson progress
    this.lessonProgress = this.progressService.getLessonProgress(this.lesson.id);

    // Load progress for each category
    this.categoryProgress = {};
    this.lesson.categories.forEach((category) => {
      this.categoryProgress[category.id] = this.progressService.getCategoryProgress(
        this.lesson!.id,
        category.id
      );
    });
  }
  selectCategory(category: Category) {
    this.selectedCategory = category;
  }

  onExerciseCompleted(result: any) {
    console.log('Exercise completed:', result);
    if (this.lesson && this.selectedCategory) {
      const completionEvent: ExerciseCompletionEvent = {
        lessonId: this.lesson.id,
        categoryId: this.selectedCategory.id,
        exerciseId: result.exerciseId,
        exerciseType: result.type,
        completed: true,
        score: result.score,
        data: result.data,
      };

      this.progressService.markExerciseCompleted(completionEvent);
    }
  }
  getTotalExercises(): number {
    return (
      this.lesson?.categories.reduce((total, category) => total + category.exercises.length, 0) || 0
    );
  }

  getCategoryIcon(type: string): string {
    const icons: { [key: string]: string } = {
      vocabulary: 'fas fa-book',
      grammar: 'fas fa-language',
      speaking: 'fas fa-microphone',
      test: 'fas fa-clipboard-check',
      review: 'fas fa-sync-alt',
      dialogue: 'fas fa-comment-dots',
      writing: 'fas fa-file-word',
    };
    return icons[type] || 'fas fa-circle';
  }
  getLessonProgressPercentage(): number {
    if (!this.lesson) return 0;

    const lessonProgress = this.progressService.getLessonProgress(this.lesson.id);
    if (!lessonProgress || lessonProgress.categories.length === 0) return 0;

    const completedCategories = lessonProgress.categories.filter((c) => c.completed).length;
    return Math.round((completedCategories / this.lesson.categories.length) * 100);
  }

  getCategoryProgressPercentage(categoryId: string, isRound: boolean): number {
    const progress = this.progressService.getCategoryProgress(this.lesson?.id || '', categoryId);
    if (isRound) {
      return progress ? Math.round(progress.progressPercentage) : 0;
    }
    return progress ? progress.progressPercentage : 0;
  }

  isCategoryCompleted(categoryId: string): boolean {
    const progress = this.progressService.getCategoryProgress(this.lesson?.id || '', categoryId);
    return progress?.completed || false;
  }

  getCompletedExercisesCount(): number {
    if (!this.lesson) return 0;

    let totalCompleted = 0;
    this.lesson.categories.forEach((category) => {
      const progress = this.progressService.getCategoryProgress(this.lesson!.id, category.id);
      if (progress) {
        totalCompleted += progress.exercises.filter((e) => e.completed).length;
      }
    });

    return totalCompleted;
  }

  getCompletedCategoriesCount(): number {
    if (!this.lesson) return 0;

    return this.lesson.categories.filter((category) => this.isCategoryCompleted(category.id))
      .length;
  }
}
