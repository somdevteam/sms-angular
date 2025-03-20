import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ExamsRoutingModule } from './exams-routing.module';
import { AddExamComponent } from './add-exam/add-exam.component';
import { ComponentsModule } from "../shared/components/components.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from '@shared';
import { ExamListComponent } from './exam-list/exam-list.component';
import { ExamResultComponent } from './exam-result/exam-result.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
    declarations: [
        AddExamComponent,
        ExamListComponent,
        ExamResultComponent,
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        ExamsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        ComponentsModule,
        SharedModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatInputModule,
        BreadcrumbModule,
        TableModule,
        InputNumberModule
    ]
})
export class ExamsModule { }
