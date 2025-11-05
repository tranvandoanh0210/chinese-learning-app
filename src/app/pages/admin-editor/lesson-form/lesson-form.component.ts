import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Lesson } from '../../../models/lesson.model';
import { AdminService } from '../../../services/admin.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-lesson-form',
  templateUrl: './lesson-form.component.html',
  styleUrls: ['./lesson-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class LessonFormComponent implements OnInit {
  lesson: Partial<Lesson> = {
    name_vi: '',
    name_zh: '',
    description: '',
    order: 0,
  };

  isEditMode = false;
  lessonId: string | null = null;
  loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.lessonId = params['lessonId'];
      this.isEditMode = !!this.lessonId;

      if (this.isEditMode && this.lessonId) {
        this.loadLesson();
      } else {
        this.setNextOrder();
      }
    });
  }

  loadLesson(): void {
    const lesson = this.dataService.getLessonById(this.lessonId!);
    if (lesson) {
      this.lesson = { ...lesson };
    }
  }

  setNextOrder(): void {
    const lessons = this.dataService.getAllLessons();
    this.lesson.order = lessons.length > 0 ? Math.max(...lessons.map((l) => l.order)) + 1 : 1;
  }

  saveLesson(): void {
    if (!this.lesson.name_vi?.trim()) {
      alert('Vui lòng nhập tên bài học');
      return;
    }

    this.loading = true;

    if (this.isEditMode && this.lessonId) {
      this.adminService.updateLesson(this.lessonId, this.lesson);
    } else {
      this.adminService.createLesson(this.lesson);
    }

    // Simulate API call
    setTimeout(() => {
      this.loading = false;
      this.router.navigate(['/admin']);
    }, 500);
  }

  cancel(): void {
    this.router.navigate(['/admin']);
  }
}
