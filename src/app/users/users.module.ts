import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users/users.component';
import {ComponentsModule} from "@shared/components/components.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "@shared";
import { FormDialogComponent } from './users/form-dialog/form-dialog.component';



@NgModule({
  declarations: [
    UsersComponent,
    FormDialogComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
  ]
})
export class UsersModule { }
