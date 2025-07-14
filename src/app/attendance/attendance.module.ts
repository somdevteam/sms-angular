import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { AddStudentAttendanceComponent } from './add-student-attendance/add-student-attendance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from '@shared';
import { ComponentsModule } from '@shared/components/components.module';


@NgModule({
  declarations: [AddStudentAttendanceComponent],
  imports: [
    CommonModule,
    AttendanceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ComponentsModule,
    MatFormFieldModule,

  ]
})
export class AttendanceModule { }
