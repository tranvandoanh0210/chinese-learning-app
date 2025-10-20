import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LessonDetailComponent } from './pages/lesson-detail/lesson-detail.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { DataManagementComponent } from './components/data-management/data-management.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'data', component: DataManagementComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'lesson/:id', component: LessonDetailComponent },
  { path: '**', redirectTo: '' },
];
