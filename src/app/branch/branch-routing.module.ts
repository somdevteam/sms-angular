import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBranchComponent } from './add-branch/add-branch.component';
import { ViewBranchComponent } from './view-branch/view-branch.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'add-branch',
    pathMatch: 'full',
  },
  {
    path: 'add-branch',
    component: AddBranchComponent,
  },
  {
    path: 'view-branch',
    component: ViewBranchComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchRoutingModule { }
