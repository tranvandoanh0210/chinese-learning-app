import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Lesson, Category } from '../../../models/lesson.model';
import { AdminService } from '../../../services/admin.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CategoryFormComponent implements OnInit {
  lesson: Lesson | undefined;
  category: Partial<Category> = {
    type: 'vocabulary',
    name: '',
    description: '',
    order: 0,
  };

  isEditMode = false;
  lessonId: string = '';
  categoryId: string | null = null;
  loading = false;

  categoryTypes = [
    { value: 'vocabulary', label: 'Từ vựng', icon: '📖' },
    { value: 'grammar', label: 'Ngữ pháp', icon: '📚' },
    { value: 'dialogue', label: 'Hội thoại', icon: '💬' },
    { value: 'writing', label: 'Luyện viết', icon: '✍️' },
    { value: 'test', label: 'Kiểm tra', icon: '📝' },
    { value: 'review', label: 'Ôn tập', icon: '🔄' },
    { value: 'speaking', label: 'Luyện nói', icon: '🎤' },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.lessonId = params['lessonId'];
      this.categoryId = params['categoryId'];
      this.isEditMode = !!this.categoryId;

      this.lesson = this.dataService.getLessonById(this.lessonId);

      if (this.isEditMode && this.categoryId && this.lesson) {
        this.loadCategory();
      } else {
        this.setNextOrder();
        this.updateCategoryName();
      }
    });
  }

  loadCategory(): void {
    if (this.lesson && this.categoryId) {
      const category = this.lesson.categories.find((cat) => cat.id === this.categoryId);
      if (category) {
        this.category = { ...category };
      }
    }
  }

  setNextOrder(): void {
    if (this.lesson) {
      this.category.order =
        this.lesson.categories.length > 0
          ? Math.max(...this.lesson.categories.map((cat) => cat.order)) + 1
          : 1;
    }
  }

  updateCategoryName(): void {
    if (!this.category.name && this.category.type) {
      const typeConfig = this.categoryTypes.find((t) => t.value === this.category.type);
      this.category.name = typeConfig ? typeConfig.label : 'Danh mục mới';
    }
  }

  onTypeChange(): void {
    this.updateCategoryName();
  }

  saveCategory(): void {
    if (!this.category.name?.trim()) {
      alert('Vui lòng nhập tên danh mục');
      return;
    }

    if (!this.lesson) {
      alert('Không tìm thấy bài học');
      return;
    }

    this.loading = true;

    if (this.isEditMode && this.categoryId) {
      this.adminService.updateCategory(this.lessonId, this.categoryId, this.category);
    } else {
      this.adminService.addCategory(this.lessonId, this.category);
    }

    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/admin/lessons', this.lessonId, 'categories']);
    }, 500);
  }

  cancel(): void {
    this.router.navigate(['/admin/lessons', this.lessonId, 'categories']);
  }

  getCategoryTypeIcon(type: string): string {
    const typeConfig = this.categoryTypes.find((t) => t.value === type);
    return typeConfig ? typeConfig.icon : '📁';
  }

  getCategoryTypeLabel(type: string): string {
    const typeConfig = this.categoryTypes.find((t) => t.value === type);
    return typeConfig ? typeConfig.label : type;
  }
}
