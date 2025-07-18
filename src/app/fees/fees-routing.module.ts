import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "@core/guard/auth.guard";
import {AddUserComponent} from "../users/add-user/add-user.component";
import {ListUsersComponent} from "../users/list-users/list-users.component";
import {Permissions} from "@shared/enums/permissions.enums";
import {AddfeesComponent} from "./addfees/addfees.component";
import {AllfeesComponent} from "./allfees/allfees.component";
import {PaymentChargeListComponent} from "./payment-charge-list/payment-charge-list.component";

const {
  feesManagement: {fees},
} = Permissions;

const routes: Routes = [
  {
    path: 'addfees',
    canActivate: [AuthGuard],
    component: AddfeesComponent,
    data: {
      permissions: [fees.ADD_FEES],
    },
  },
  {
    path: 'allFees',
    canActivate: [AuthGuard],
    component: AllfeesComponent,
    data: {
      permissions: [fees.VIEW_FEES],
    },
  },
  {
    path: 'paymentchargerequest',
    canActivate: [AuthGuard],
    component: PaymentChargeListComponent,
    data: {
      permissions: [fees.VIEWPAYMENTCHARGE],
    },
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class FeesRoutingModule { }
