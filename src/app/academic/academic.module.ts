import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcademicRoutingModule } from './academic-routing.module';
import { ClassComponent } from './class/class.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared';
import { ComponentsModule } from '@shared/components/components.module';


@NgModule({
  declarations: [
    ClassComponent
  ],
  imports: [
    CommonModule,
    AcademicRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
  ]
})
export class AcademicModule { }
