import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserComponent } from './add-user/add-user.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { AuthGuard } from '@core/guard/auth.guard';

const routes: Routes = [
  {
    path: 'adduser',
    canActivate: [AuthGuard],
    component: AddUserComponent,
  },
  {
    path: 'userlist',
    canActivate: [AuthGuard],
    component: ListUsersComponent,
  },
  {
    path: 'edit',
    canActivate: [AuthGuard],
    component: AddUserComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
