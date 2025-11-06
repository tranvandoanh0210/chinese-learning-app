import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Lesson, Category } from '../../../models/lesson.model';
import { AdminService } from '../../../services/admin.service';
import { DataService } from '../../../services/data.service';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  standalone: true,
  imports: [CommonModule, ConfirmDialogComponent],
})
export class CategoryListComponent implements OnInit {
  lesson: Lesson | undefined;
  categories: Category[] = [];
  lessonId: string = '';
  loading = true;
  showDeleteDialog = false;
  categoryToDelete: Category | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.lessonId = params['lessonId'];
      this.loadData();
    });
  }

  loadData(): void {
    this.lesson = this.dataService.getLessonById(this.lessonId);
    if (this.lesson) {
      this.categories = this.lesson.categories;
    }
    this.loading = false;
  }

  createCategory(): void {
    this.router.navigate(['/admin/lessons', this.lessonId, 'categories', 'create']);
  }

  editCategory(category: Category): void {
    this.router.navigate(['/admin/lessons', this.lessonId, 'categories', category.id, 'edit']);
  }

  viewExercises(category: Category): void {
    this.router.navigate(['/admin/lessons', this.lessonId, 'categories', category.id, 'exercises']);
  }

  deleteCategory(category: Category): void {
    this.categoryToDelete = category;
    this.showDeleteDialog = true;
  }

  confirmDelete(): void {
    if (this.categoryToDelete) {
      this.adminService.deleteCategory(this.lessonId, this.categoryToDelete.id);
      this.loadData();
    }
    this.showDeleteDialog = false;
    this.categoryToDelete = null;
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;
    this.categoryToDelete = null;
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }

  getCategoryTypeName(type: string): string {
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

  getTotalExercises(category: Category): number {
    return category.exercises.length;
  }
}
