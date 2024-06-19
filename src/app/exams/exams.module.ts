import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamsRoutingModule } from './exams-routing.module';
import { AddExamComponent } from './add-exam/add-exam.component';
import { ComponentsModule } from "../shared/components/components.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from '@shared';
import { ExamListComponent } from './exam-list/exam-list.component';


@NgModule({
    declarations: [
        AddExamComponent,
        ExamListComponent,
    ],
    imports: [
        CommonModule,
        ExamsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        ComponentsModule,
        SharedModule,
        MatFormFieldModule
    ]
})
export class ExamsModule { }
