import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './add-user/add-user.component';
import { ListUsersComponent } from './list-users/list-users.component';
import {Permissions} from "@shared/enums/permissions.enums";
import {AuthGuard} from "@core/guard/auth.guard";

const {
  userManagement: {users},
} = Permissions;

const routes: Routes = [
  {
    path: 'adduser',
    canActivate: [AuthGuard],
    component: AddUserComponent,
    data: {
      permissions: [users.CREATE_USER],
    },
  },
  {
    path: 'userlist',
    canActivate: [AuthGuard],
    component: ListUsersComponent,
    data: {
      permissions: [users.VIEW_USER],
    },
  },
  {
    path: 'edit',
    component: AddUserComponent,
    data: { permissions: [...Object.values(users)] }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
