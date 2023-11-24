import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchRoutingModule } from './branch-routing.module';
import { AddBranchComponent } from './add-branch/add-branch.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from '@shared';
import { ComponentsModule } from '@shared/components/components.module';
import { ViewBranchComponent } from './view-branch/view-branch.component';


@NgModule({
  declarations: [
    AddBranchComponent,
    ViewBranchComponent
  ],
  imports: [
    CommonModule,
    BranchRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    MatFormFieldModule
  ]
})
export class BranchModule { }
