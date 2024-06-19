import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

import { SnackbarService } from '@shared/snackbar.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';
import { UserService } from 'app/users/user.service';
import { ExamsService } from '../exams.service';

@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.scss']
})
export class ExamListComponent implements OnInit {
  breadscrums = [
    { title: 'Exams', items: ['Exam List'], active: 'Exam' }
  ];
  
  examListForm!: FormGroup;
  editForm!: FormGroup;
  branchesList: any[] = [];
  
  displayedColumns: string[] = ['examId', 'examName', 'description', 'startDate', 'endDate', 'dateCreated', 'isActive', 'action'];
  dataSource = new MatTableDataSource<any>([]);
  
  examList: any = []
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('editDialog') editDialog!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: SnackbarService,
    private pageLoader: PageLoaderService,
    private examService: ExamsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadBranches();
  }

  private initForm(): void {
    this.examListForm = this.fb.group({
      branchId: [null, Validators.required]
    });

    //for editing
    this.editForm = this.fb.group({
      branch: [null, [Validators.required]],
      exam: [null, [Validators.required]],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      description: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
    });
  }

  private loadBranches(): void {
    this.userService.getBranches().subscribe({
      next: (res) => {
        this.branchesList = res.length > 0 ? res : [];
      },
      error: (error) => {
        this.snackBar.dangerNotification(error.message);
      }
    });
  }

  onSubmit(): void {
    if (this.examListForm.invalid) {
      return;
    }

    const branchId = this.examListForm.get('branchId')?.value;
    this.pageLoader.showLoader();

    this.examService.findExamsByBranch(branchId).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.pageLoader.hideLoader();
      },
      error: (error) => {
        this.pageLoader.hideLoader();
        this.snackBar.dangerNotification(error.message);
      }
    });
  }

  editExam(exam: any): void {
    const  branchId = exam.examsInfo.academicBranch.branch.branchId;
    alert(branchId)
    this.editForm.setValue({
      branch: [branchId, [Validators.required]],
      exam: [null, [Validators.required]],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      description: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
    });
    
    this.dialog.open(this.editDialog, {
     
      data: exam
    });
  }
}
