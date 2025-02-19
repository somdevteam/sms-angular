import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@core';
import { SnackbarService } from '@shared/snackbar.service';
import { BranchService } from 'app/branch/branch.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';
import { AcademicService } from '../academic.service';
import { AssignSectionComponent } from './assign-section/assign-section.component';
import { AssignSubjectComponent } from './assign-subject/assign-subject.component';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss'],
})
export class ClassComponent implements OnInit {

  constructor(
    private fb: UntypedFormBuilder,
    private branchService: BranchService,
    private snackBar: SnackbarService,
    private pageLoader: PageLoaderService,
    private dialog: MatDialog,
    private academicService: AcademicService
  ) {}

  breadscrums = [
    {
      title: 'Class',
      items: ['List Class'],
      active: 'Class',
    },
  ];
  branchesList: any;
  levelList: any;
  classForm?: FormGroup;
  selectedStatus: '0' | '1' = '1';
  classes: any[] = [];
  subjects: any;

  @ViewChild('viewSubjectsDialog') viewSubjectsDialog!: TemplateRef<any>;

  ngOnInit(): void {
    let formFields = {
      branchId: ['', Validators.required],
      levelId: ['', Validators.required],
      isActive: ['1'],
    };
    this.classForm = this.fb.group(formFields);

    this.loadBranches();
  }

  onBranchChange(branchId: any) {
    this.classForm?.controls['levelId'].setValue('');
    this.academicService.findLevelByBranchId(branchId).subscribe({
      next: (res) => {
        this.levelList = res;
      },
      error: (error) => {
        this.snackBar.dangerNotification(error);
      }
    });
  }

  loadBranches() {
    this.branchService.getBranches().subscribe({
      next: (res) => {
        this.branchesList = res;
      },
      error: (error) => {
        this.snackBar.dangerNotification(error);
      }
    });
  }

  onSubmit() {
    const payload = this.classForm?.value;
    this.pageLoader.showLoader();
    this.academicService.findClassByBranchAndLevel(payload).subscribe({
      next: (res) => {
        this.classes = res;
        this.pageLoader.hideLoader();
      },
      error: (error) => {
        this.pageLoader.hideLoader();
        this.snackBar.dangerNotification(error);
      }
    });
  }

  assignClassSection(row: any) {
    this.dialog.open(AssignSectionComponent, {
      data: {
        classId: row.class.classid,
        className: row.class.classname,
        branchId: row.branch.branchId
      }
    });
  }

  assignClassSubject(row: any) {
    this.dialog.open(AssignSubjectComponent, {
      data: {
        classId: row.class.classid,
        className: row.class.classname,
        branchId: row.branch.branchId
      }
    });
  }

  openViewSubjectsDialog(row: any): void {
    const payload = {
      classId: row.class.classid,
      branchId: row.branch.branchId
    }
   this.academicService.findSubjectsByClass(payload).subscribe({
    next: (res) => {
      this.subjects = res.data;
      this.dialog.open(this.viewSubjectsDialog);
    },
    error: (error) => {
      this.snackBar.dangerNotification(error);
    }
   });
  
  }
}