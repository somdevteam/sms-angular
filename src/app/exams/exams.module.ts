import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamsRoutingModule } from './exams-routing.module';
import { AddExamComponent } from './add-exam/add-exam.component';


@NgModule({
  declarations: [
    AddExamComponent
  ],
  imports: [
    CommonModule,
    ExamsRoutingModule
  ]
})
export class ExamsModule { }
