import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import {ComponentsModule} from "@shared/components/components.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "@shared";
import { AddUserComponent } from './add-user/add-user.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { ResetPasswordComponent } from './list-users/reset-password/reset-password.component';
import { LoginHistoriesComponent } from './list-users/login-histories/login-histories.component';
import { EditUserComponent } from './edit-user/edit-user.component';



@NgModule({
  declarations: [
    AddUserComponent,
    ListUsersComponent,
    ResetPasswordComponent,
    LoginHistoriesComponent,
    EditUserComponent
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
