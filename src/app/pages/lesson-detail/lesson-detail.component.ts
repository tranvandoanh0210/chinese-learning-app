import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Lesson, Category } from '../../models/lesson.model';
import { DataService } from '../../services/data.service';
import { ExerciseDisplayComponent } from '../../components/exercise/exercise-display/exercise-display.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lesson-detail',
  templateUrl: './lesson-detail.component.html',
  styleUrls: ['./lesson-detail.component.css'],
  imports: [ExerciseDisplayComponent, CommonModule, RouterModule],
  standalone: true,
})
export class LessonDetailComponent implements OnInit, OnDestroy {
  private routeSub!: Subscription;
  lesson?: Lesson;
  selectedCategory?: Category;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.loadLesson(params['id']);
    });
  }
  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
  private loadLesson(lessonId: string): void {
    const lesson = this.dataService.getLessonById(lessonId);

    if (lesson) {
      this.lesson = lesson;
      // Reset selected category when lesson changes
      this.selectedCategory = undefined;
    } else {
      // Lesson not found, redirect to home
      this.router.navigate(['/']);
    }
  }
  selectCategory(category: Category) {
    this.selectedCategory = category;
  }

  onExerciseCompleted(result: any) {
    console.log('Exercise completed:', result);
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
    };
    return icons[type] || 'fas fa-circle';
  }
}
