import { Page404Component } from './authentication/page404/page404.component';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
import { Role } from './core/models/role';
import { AcademicYearComponent } from './academic/academic-year/academic-year.component';
import {Permissions} from "@shared/enums/permissions.enums";
const {
  userManagement: {users},
} = Permissions;
const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/authentication/signin', pathMatch: 'full' },
      {
        path: 'admin',
        canActivate: [AuthGuard],
        data: {
          role: [Role.Admin, Role.SuperAdmin],
        },
        loadChildren: () =>
          import('./admin/admin.module').then((m) => m.AdminModule),
      },
      {
        path: 'teacher',
        canActivate: [AuthGuard],
        data: {
          role: Role.Teacher,
        },
        loadChildren: () =>
          import('./teacher/teacher.module').then((m) => m.TeacherModule),
      },
      {
        path: 'student',
        canActivate: [AuthGuard],
        data: {
          role: Role.Student,
        },
        loadChildren: () =>
          import('./student/student.module').then((m) => m.StudentModule),
      },

      // Extra components
      {
        path: 'extra-pages',
        loadChildren: () =>
          import('./extra-pages/extra-pages.module').then(
            (m) => m.ExtraPagesModule
          ),
      },
      {
        path: 'branch',
        loadChildren: () =>
          import('./branch/branch.module').then(
            (m) => m.BranchModule
          ),
      },
      {
        path: 'users',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./users/users.module').then(
            (m) => m.UsersModule
          ),
      },
      {
        path: 'academic',
        loadChildren: () =>
          import('./academic/academic.module').then(
            (m) => m.AcademicModule
          ),
      },
      {
        path: 'multilevel',
        loadChildren: () =>
          import('./multilevel/multilevel.module').then(
            (m) => m.MultilevelModule
          ),
      },
    ],
  },
  {
    path: 'authentication',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  { path: '**', component: Page404Component },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
