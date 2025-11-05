import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LessonDetailComponent } from './pages/lesson-detail/lesson-detail.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { DataManagementComponent } from './components/data-management/data-management.component';
import { AdminDashboardComponent } from './pages/admin-editor/admin-dashboard/admin-dashboard.component';
import { MainLayoutWithoutNavigationComponent } from './pages/main-layout-without-navigation/main-layout-without-navigation.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { LessonFormComponent } from './pages/admin-editor/lesson-form/lesson-form.component';
import { CategoryFormComponent } from './pages/admin-editor/category-form/category-form.component';
import { CategoryListComponent } from './pages/admin-editor/category-list/category-list.component';
import { ExerciseFormComponent } from './pages/admin-editor/exercise-form/exercise-form.component';
import { ExerciseListComponent } from './pages/admin-editor/exercise-list/exercise-list.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'lesson/:id', component: LessonDetailComponent },
    ],
  },
  {
    path: 'admin',
    component: MainLayoutWithoutNavigationComponent,
    children: [
      { path: '', component: AdminDashboardComponent }, // /admin

      // Lesson routes
      { path: 'lessons/create', component: LessonFormComponent }, // /admin/lessons/create
      { path: 'lessons/:lessonId/edit', component: LessonFormComponent }, // /admin/lessons/123/edit

      // Category routes
      { path: 'lessons/:lessonId/categories', component: CategoryListComponent }, // /admin/lessons/123/categories
      { path: 'lessons/:lessonId/categories/create', component: CategoryFormComponent }, // /admin/lessons/123/categories/create
      { path: 'lessons/:lessonId/categories/:categoryId/edit', component: CategoryFormComponent }, // /admin/lessons/123/categories/456/edit

      // Exercise routes
      {
        path: 'lessons/:lessonId/categories/:categoryId/exercises',
        component: ExerciseListComponent,
      }, // /admin/lessons/123/categories/456/exercises
      {
        path: 'lessons/:lessonId/categories/:categoryId/exercises/create',
        component: ExerciseFormComponent,
      }, // /admin/lessons/123/categories/456/exercises/create
      {
        path: 'lessons/:lessonId/categories/:categoryId/exercises/:exerciseId/edit',
        component: ExerciseFormComponent,
      }, // /admin/lessons/123/categories/456/exercises/789/edit
    ],
  },
  // {
  //   path: 'admin',
  //   component: AdminDashboardComponent,
  //   data: { showNavigation: false },
  // },
  // {
  //   path: 'admin/exercises/:lessonId/:categoryId',
  //   component: ExerciseEditorComponent,
  //   data: { showNavigation: false },
  // },
  // {
  //   path: 'admin/exercises/:lessonId/:categoryId/:exerciseId',
  //   component: ExerciseEditorComponent,
  //   data: { showNavigation: false },
  // },
  // { path: 'data', component: DataManagementComponent, data: { showNavigation: false } },
  { path: 'welcome', component: WelcomeComponent },
  { path: '**', redirectTo: '' },
];
