import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { BranchService } from 'app/branch/branch.service';
import { SnackbarService } from '@shared/snackbar.service';
import { ExamsService } from '../exams.service';

@Component({
  selector: 'app-exam-result',
  templateUrl: './exam-result.component.html',
  styleUrls: ['./exam-result.component.scss']
})
export class ExamResultComponent implements OnInit {
  breadscrums = [
    { title: 'Exams', items: ['Exam Result'], active: 'Exam Result' }
  ];
  
  examForm: FormGroup;
  branches: any[] = [];
  exams: any[] = [];
  classes: any[] = [];
  sections: any[] = [];

  loading = {
    branches: false,
    exams: false,
    classes: false,
    sections: false,
    submit: false
  };

  constructor(
    private fb: FormBuilder,
    private examService: ExamsService,
    private branchService: BranchService,
    private snackBar: SnackbarService
  ) {
    this.examForm = this.fb.group({
      branch: ['', [Validators.required]],
      exam: ['', [Validators.required]],
      class: [{ value: '', disabled: true }, [Validators.required]],
      section: [{ value: '', disabled: true }, [Validators.required]]
    });

    // Listen to branch changes
    this.examForm.get('branch')?.valueChanges.subscribe(branchId => {
      this.examForm.patchValue({ exam: '', class: '', section: '' });
      if (branchId) {
        this.loadExams();
      } else {
        this.exams = [];
        this.examForm.get('class')?.disable();
        this.examForm.get('section')?.disable();
      }
    });

    // Listen to exam changes
    this.examForm.get('exam')?.valueChanges.subscribe(examId => {
      this.examForm.patchValue({ class: '', section: '' });
      if (examId) {
        this.loadClasses(examId);
        this.examForm.get('class')?.enable();
        this.examForm.get('section')?.disable();
      } else {
        this.classes = [];
        this.examForm.get('class')?.disable();
        this.examForm.get('section')?.disable();
      }
    });

    // Listen to class changes
    this.examForm.get('class')?.valueChanges.subscribe(classId => {
      this.examForm.patchValue({ section: '' });
      if (classId) {
        this.loadSections(classId);
        this.examForm.get('section')?.enable();
      } else {
        this.sections = [];
        this.examForm.get('section')?.disable();
      }
    });
  }

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.loadBranches();
    this.loadExams();
  }

  loadBranches() {
    this.loading.branches = true;
    this.branchService.getBranches()
      .pipe(finalize(() => this.loading.branches = false))
      .subscribe({
        next: (data) => {
          this.branches = data;
        },
        error: (error) => {
          console.error('Error loading branches:', error);
          this.snackBar.openSnackBar('Error loading branches');
        }
      });
  }

  loadExams() {
    const branchId = this.examForm.get('branch')?.value;
    if (!branchId) {
      this.exams = [];
      return;
    }

    this.loading.exams = true;
    this.examService.getExamsByBranch(Number(branchId))
      .pipe(finalize(() => this.loading.exams = false))
      .subscribe({
        next: (res) => {
          this.exams = res.data;
        },
        error: (error) => {
          console.error('Error loading exams:', error);
          this.snackBar.openSnackBar(error);
          this.exams = [];
        }
      });
  }

  loadClasses(examId: number) {
    this.loading.classes = true;
    this.examService.getClassesByExam(examId)
      .subscribe({
        next: (res: any) => {
          this.loading.classes = false;
          this.classes = res.data;
        },
        error: (error) => {
          console.error('Error loading classes:', error);
          this.snackBar.openSnackBar(error);
        }
      });
  }

  loadSections(classId: number) {
    this.loading.sections = true;
    this.examService.getSectionsByClass(classId)
      .pipe(finalize(() => this.loading.sections = false))
      .subscribe({
        next: (data) => {
          this.sections = data;
        },
        error: (error) => {
          console.error('Error loading sections:', error);
          // Handle error appropriately
        }
      });
  }

  getErrorMessage(field: string): string {
    if (this.examForm.get(field)?.hasError('required')) {
      return 'This field is required';
    }
    return '';
  }

  onSubmit() {
    if (this.examForm.valid) {
      this.loading.submit = true;
      this.examService.submitExamResult(this.examForm.value)
        .pipe(finalize(() => this.loading.submit = false))
        .subscribe({
          next: (response) => {
            console.log('Form submitted successfully:', response);
            // Handle success (show message, redirect, etc.)
          },
          error: (error) => {
            console.error('Error submitting form:', error);
            // Handle error appropriately
          }
        });
    } else {
      Object.keys(this.examForm.controls).forEach(key => {
        const control = this.examForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
