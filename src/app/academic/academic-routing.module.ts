import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcademicYearComponent } from './academic-year/academic-year.component';
import { LevelsComponent } from './levels/levels.component';

const routes: Routes = [
  {
    path: 'academic-year',
    component: AcademicYearComponent,
  },
  {
    path: 'levels',
    component: LevelsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcademicRoutingModule { }
