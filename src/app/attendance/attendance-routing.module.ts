import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStudentAttendanceComponent } from './add-student-attendance/add-student-attendance.component';

const routes: Routes = [
  {
    path: 'add-student-attendance',
    component: AddStudentAttendanceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
