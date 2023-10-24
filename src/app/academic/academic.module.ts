import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcademicRoutingModule } from './academic-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared';
import { ComponentsModule } from '@shared/components/components.module';
import { AcademicYearComponent } from './academic-year/academic-year.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AcademicDialogComponent } from './academic-year/academic-dialog/academic-dialog.component';
import { LevelsComponent } from './levels/levels.component';
import { AssingClassComponent } from './levels/assing-class/assing-class.component';


@NgModule({
  declarations: [
    AcademicYearComponent,
    AcademicDialogComponent,
    LevelsComponent,
    AssingClassComponent
  ],
  imports: [
    CommonModule,
    AcademicRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    MatFormFieldModule
  ]
})
export class AcademicModule { }
