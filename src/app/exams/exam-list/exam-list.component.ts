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
  assignForm!: FormGroup;
  branchesList: any[] = [];

  displayedColumns: string[] = ['examId', 'examName', 'description', 'startDate', 'endDate', 'dateCreated', 'isActive', 'action'];
  dataSource = new MatTableDataSource<any>([]);

  examList: any = []
  today: Date = new Date();
  examinfoId: any = null;
  selectedExam: any = null;
  classList:any = []

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('editDialog') editDialog!: TemplateRef<any>;
  @ViewChild('assignExamToClassDialog') assignExamToClassDialog!: TemplateRef<any>;
  


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: SnackbarService,
    private pageLoader: PageLoaderService,
    private examService: ExamsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadBranches();
  }

  closeDialog() {
    this.dialog.closeAll()
  }

  private initForm(): void {
    this.examListForm = this.fb.group({
      branchId: [null, Validators.required]
    });


    //for editing dialog
    this.editForm = this.fb.group({
      branch: [null, [Validators.required]],
      exam: [null, [Validators.required]],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      description: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
    });

    // assign exam to class dialog
    this.assignForm = this.fb.group({
      exam: [null, Validators.required]
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
        this.examList = res;
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.pageLoader.hideLoader();
      },
      error: (error) => {
        this.pageLoader.hideLoader();
        this.snackBar.dangerNotification(error);
      }
    });
  }

  editExam(exam: any): void {
    this.examinfoId = exam.examsInfo.examInfoId;
    const examId = exam.examId
    const branchId = exam.examsInfo.academicBranch.branch.branchId;
    const startDate = exam.examsInfo.startDate;
    const endDate = exam.examsInfo.endDate;
    const description = exam.examsInfo.description;
    this.editForm.patchValue({
      branch: branchId,
      exam: examId,
      startDate: startDate,
      endDate: endDate,
      description: description,
    });

    this.dialog.open(this.editDialog, {

      data: exam
    });
  }

  onUpdate() {
    if (this.editForm.invalid) {
      return;
    }
    const payload = {
      branchId: this.editForm.get('branch')?.value,
      examId: this.editForm.get('exam')?.value,
      startDate: this.editForm.get('startDate')?.value,
      endDate: this.editForm.get('endDate')?.value,
      description: this.editForm.get('description')?.value
    }
    this.pageLoader.showLoader();
    this.examService.updateExamInfo(this.examinfoId, payload).subscribe({
      next: (res => {
        this.pageLoader.hideLoader();
        this.dialog.closeAll()
      }),
      error: (error => {
        this.pageLoader.hideLoader();
        this.snackBar.dangerNotification(error);
      })
    })


  }


  assignClass(row: any) {
    this.selectedExam = row;
    this.assignForm.patchValue({
      exam: row.examsInfo.examInfoId
    })
    let payload = {
      examInfoId : row.examsInfo.examInfoId,
      branchId:    row.examsInfo.academicBranch.branch.branchId
    }
    
    this.examService.findExamClasses(payload).subscribe({
      next: (res => {
        this.classList = res;
        this.dialog.open(this.assignExamToClassDialog, {
          'width': '30%'
        })
      }),
      error: (error => {
        this.snackBar.dangerNotification(error);
        
      })
    })
    
  }
}
