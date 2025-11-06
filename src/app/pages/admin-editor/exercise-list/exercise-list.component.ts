import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Exercise,
  isVocabularyExercise,
  isGrammarExercise,
  isMultipleChoiceExercise,
  isDialogueExercise,
} from '../../../models/exercise.model';
import { Lesson, Category } from '../../../models/lesson.model';
import { AdminService } from '../../../services/admin.service';
import { DataService } from '../../../services/data.service';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-exercise-list',
  templateUrl: './exercise-list.component.html',
  styleUrls: ['./exercise-list.component.css'],
  standalone: true,
  imports: [CommonModule, ConfirmDialogComponent],
})
export class ExerciseListComponent implements OnInit {
  lesson: Lesson | undefined;
  category: Category | undefined;
  exercises: Exercise[] = [];
  lessonId: string = '';
  categoryId: string = '';
  loading = true;
  showDeleteDialog = false;
  exerciseToDelete: Exercise | null = null;
  countExerciseType: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.countExerciseType = this.dataService.getExerciseTypesCount();

    this.route.params.subscribe((params) => {
      this.lessonId = params['lessonId'];
      this.categoryId = params['categoryId'];
      this.loadData();
    });
  }

  loadData(): void {
    this.lesson = this.dataService.getLessonById(this.lessonId);
    if (this.lesson) {
      this.category = this.lesson.categories.find((cat) => cat.id === this.categoryId);
      if (this.category) {
        this.exercises = this.category.exercises;
      }
    }
    this.loading = false;
  }

  createExercise(): void {
    this.router.navigate([
      '/admin/lessons',
      this.lessonId,
      'categories',
      this.categoryId,
      'exercises',
      'create',
    ]);
  }

  editExercise(exercise: Exercise): void {
    this.router.navigate([
      '/admin/lessons',
      this.lessonId,
      'categories',
      this.categoryId,
      'exercises',
      exercise.id,
      'edit',
    ]);
  }

  deleteExercise(exercise: Exercise): void {
    this.exerciseToDelete = exercise;
    this.showDeleteDialog = true;
  }

  confirmDelete(): void {
    if (this.exerciseToDelete) {
      this.adminService.deleteExercise(this.lessonId, this.categoryId, this.exerciseToDelete.id);
      this.loadData();
    }
    this.showDeleteDialog = false;
    this.exerciseToDelete = null;
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;
    this.exerciseToDelete = null;
  }

  goBack(): void {
    this.router.navigate(['/admin/lessons', this.lessonId, 'categories']);
  }

  getExerciseTypeName(type: string): string {
    const nameMap: { [key: string]: string } = {
      vocabulary: 'Từ vựng',
      grammar: 'Ngữ pháp',
      multiple_choice: 'Trắc nghiệm',
      input: 'Nhập liệu',
      speaking: 'Luyện nói',
      flashcard: 'Flashcard',
      dialogue: 'Hội thoại',
      writing: 'Luyện viết',
    };
    return nameMap[type] || type;
  }

  getExerciseTypeIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      vocabulary: '📖',
      grammar: '📚',
      multiple_choice: '🔘',
      input: '⌨️',
      speaking: '🎤',
      flashcard: '🎴',
      dialogue: '💬',
      writing: '✍️',
    };
    return iconMap[type] || '📝';
  }

  getExercisePreview(exercise: Exercise): string {
    if (isVocabularyExercise(exercise)) {
      return exercise.pinyin || '—';
    } else if (isGrammarExercise(exercise)) {
      return exercise.content ? exercise.content.substring(0, 50) + '...' : '—';
    } else if (isMultipleChoiceExercise(exercise)) {
      return `${exercise.options?.length || 0} lựa chọn`;
    } else if (isDialogueExercise(exercise)) {
      return `${exercise.lines?.length || 0} lượt hội thoại`;
    }
    return exercise.answer || '—';
  }
}
