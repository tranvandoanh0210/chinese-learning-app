import { Component, HostListener, Input, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Lesson } from '../../models/lesson.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class NavigationComponent implements OnInit {
  lessons: Lesson[] = [];
  private lessonsSubscription!: Subscription;

  @Input() isMobileOpen = false;
  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit() {
    this.lessonsSubscription = this.dataService.lessons$.subscribe(
      (lessons) => {
        this.lessons = lessons;
      },
      (error) => {
        console.error('HomeComponent: Error loading lessons', error);
      }
    );
  }
  ngOnDestroy() {
    // Clean up subscription để tránh memory leak
    if (this.lessonsSubscription) {
      this.lessonsSubscription.unsubscribe();
    }
  }
  isMobileDevice(): boolean {
    return window.innerWidth <= 768;
  }
  openMobileNav(): void {
    this.isMobileOpen = true;
    // Ngăn scroll body khi menu mở
    document.body.style.overflow = 'hidden';
  }

  // Đóng mobile navigation
  closeMobileNav(): void {
    this.isMobileOpen = false;
    // Khôi phục scroll body
    document.body.style.overflow = '';
  }

  // Toggle mobile navigation
  toggleMobileNav(): void {
    if (this.isMobileOpen) {
      this.closeMobileNav();
    } else {
      this.openMobileNav();
    }
  }
  selectLesson(lessonId: string) {
    this.router.navigate(['/lesson', lessonId]);
    if (this.isMobileDevice()) {
      this.closeMobileNav();
    }
  }

  isActive(lessonId: string): boolean {
    return this.router.url.includes(lessonId);
  }

  getProgress(lessonId: string): number {
    // Mock progress - in real app, this would come from user data
    const progressMap: { [key: string]: number } = {
      'lesson-1': 75,
      'lesson-2': 20,
    };
    return progressMap[lessonId] || 0;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (window.innerWidth > 768 && this.isMobileOpen) {
      this.closeMobileNav();
    }
  }
}
