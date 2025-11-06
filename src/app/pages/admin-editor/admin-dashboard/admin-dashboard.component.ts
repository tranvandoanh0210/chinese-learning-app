import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Lesson } from '../../../models/lesson.model';
import { AdminService } from '../../../services/admin.service';
import { DataService } from '../../../services/data.service';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { ExcelService } from '../../../services/excel.service';
import { DataManagementComponent } from '../../../components/data-management/data-management.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmDialogComponent, DataManagementComponent],
})
export class AdminDashboardComponent implements OnInit {
  lessons: Lesson[] = [];
  private lessonsSubscription!: Subscription;
  loading = true;
  showDeleteDialog = false;
  lessonToDelete: Lesson | null = null;
  countCategory: number = 0;
  countExercise: number = 0;

  constructor(
    private dataService: DataService,
    private adminService: AdminService,
    private router: Router,
    private excelService: ExcelService
  ) {}

  ngOnInit() {
    this.countCategory = this.dataService.getTotalCategoriesStats();
    this.countExercise = this.dataService.getTotalExercisesStats();

    this.loadLessons();
  }

  loadLessons(): void {
    this.lessonsSubscription = this.dataService.lessons$.subscribe(
      (lessons) => {
        this.lessons = lessons;
      },
      (error) => {
        console.error('HomeComponent: Error loading lessons', error);
      }
    );
    this.loading = false;
  }
  ngOnDestroy() {
    // Clean up subscription để tránh memory leak
    if (this.lessonsSubscription) {
      this.lessonsSubscription.unsubscribe();
    }
  }
  createLesson(): void {
    this.router.navigate(['/admin/lessons/create']);
  }

  editLesson(lesson: Lesson): void {
    this.router.navigate(['/admin/lessons', lesson.id, 'edit']);
  }

  viewCategories(lesson: Lesson): void {
    this.router.navigate(['/admin/lessons', lesson.id, 'categories']);
  }

  deleteLesson(lesson: Lesson): void {
    this.lessonToDelete = lesson;
    this.showDeleteDialog = true;
  }

  confirmDelete(): void {
    if (this.lessonToDelete) {
      this.adminService.deleteLesson(this.lessonToDelete.id);
      this.loadLessons();
    }
    this.showDeleteDialog = false;
    this.lessonToDelete = null;
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;
    this.lessonToDelete = null;
  }

  exportLesson(lesson: Lesson): void {
    this.excelService.exportSingleLesson(lesson);
  }

  getTotalCategories(lesson: Lesson): number {
    return lesson.categories.length;
  }

  getTotalExercises(lesson: Lesson): number {
    return lesson.categories.reduce((total, category) => total + category.exercises.length, 0);
  }
}
