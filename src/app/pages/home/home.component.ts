import { Component, OnInit } from '@angular/core';
import { Lesson } from '../../models/lesson.model';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class HomeComponent implements OnInit {
  lessons: Lesson[] = [];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit() {
    this.lessons = this.dataService.getAllLessons();
  }

  selectLesson(lessonId: string) {
    this.router.navigate(['/lesson', lessonId]);
  }
}
