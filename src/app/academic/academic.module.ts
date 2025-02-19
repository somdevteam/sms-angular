import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcademicRoutingModule } from './academic-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared';
import { ComponentsModule } from '@shared/components/components.module';
import { AcademicYearComponent } from './academic-year/academic-year.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AcademicDialogComponent } from './academic-year/academic-dialog/academic-dialog.component';
import { LevelsComponent } from './levels/levels.component';
import { AssingClassComponent } from './levels/assing-class/assing-class.component';
import { ViewClassComponent } from './levels/view-class/view-class.component';
import { ClassComponent } from './class/class.component';
import { AssignSectionComponent } from './class/assign-section/assign-section.component';
import { AssignSubjectComponent } from './class/assign-subject/assign-subject.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

@NgModule({
  declarations: [
    AcademicYearComponent,
    AcademicDialogComponent,
    LevelsComponent,
    AssingClassComponent,
    ViewClassComponent,
    ClassComponent,
    AssignSectionComponent,
    AssignSubjectComponent,
  ],
  imports: [
    CommonModule,
    AcademicRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    MatFormFieldModule,
    MatMenuModule,
    MatIconModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    TagModule
  ]
})
export class AcademicModule { }
