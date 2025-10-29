import { Component, OnInit } from '@angular/core';
import { Lesson } from '../../models/lesson.model';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class HomeComponent implements OnInit {
  lessons: Lesson[] = [];
  private lessonsSubscription!: Subscription;
  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit() {
    // Subscribe to lessons changes
    this.lessonsSubscription = this.dataService.lessons$.subscribe(
      (lessons) => {
        this.lessons = lessons;
      },
      (error) => {
        console.error('HomeComponent: Error loading lessons', error);
      }
    );
  }

  selectLesson(lessonId: string) {
    this.router.navigate(['/lesson', lessonId]);
  }
  ngOnDestroy() {
    // Clean up subscription để tránh memory leak
    if (this.lessonsSubscription) {
      this.lessonsSubscription.unsubscribe();
    }
  }
}
