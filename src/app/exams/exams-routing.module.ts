import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddExamComponent } from './add-exam/add-exam.component';
import { ExamListComponent } from './exam-list/exam-list.component';
import { ExamResultComponent } from './exam-result/exam-result.component';

const routes: Routes = [
  { path: 'addexam', component: AddExamComponent },
  { path: 'examslist', component: ExamListComponent },
  { path: 'results', component: ExamResultComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamsRoutingModule { }
