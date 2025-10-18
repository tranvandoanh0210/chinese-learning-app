import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Lesson } from '../../models/lesson.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class NavigationComponent implements OnInit {
  lessons: Lesson[] = [];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit() {
    this.lessons = this.dataService.getAllLessons();
  }

  selectLesson(lessonId: string) {
    this.router.navigate(['/lesson', lessonId]);
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
}
