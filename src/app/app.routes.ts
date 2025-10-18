import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LessonDetailComponent } from './pages/lesson-detail/lesson-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'lesson/:id', component: LessonDetailComponent },
  { path: '**', redirectTo: '' },
];
