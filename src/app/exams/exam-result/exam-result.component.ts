import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { BranchService } from 'app/branch/branch.service';
import { SnackbarService } from '@shared/snackbar.service';
import { ExamsService } from '../exams.service';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-exam-result',
  templateUrl: './exam-result.component.html',
  styleUrls: ['./exam-result.component.scss']
})
export class ExamResultComponent implements OnInit, OnDestroy {
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
    submit: false,
    saving: false
  };
  results: any[] = [];
  subjects: any[] = [];
  value1!: number;
  unsavedChanges: Map<string, any> = new Map();
  hasSearched: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private examService: ExamsService,
    private branchService: BranchService,
    private snackBar: SnackbarService
  ) {
    this.examForm = this.fb.group({
      branchId: ['', [Validators.required]],
      examId: ['', [Validators.required]],
      classId: [{ value: '', disabled: true }, [Validators.required]],
      sectionId: [{ value: '', disabled: true }, [Validators.required]]
    });

    // Listen to branch changes
    this.examForm.get('branchId')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged()
    ).subscribe(branchId => {
      this.examForm.patchValue({ examId: '', classId: '', sectionId: '' });
      this.results = [];
      this.subjects = [];
      this.unsavedChanges.clear();
      if (branchId) {
        this.loadExams();
      } else {
        this.exams = [];
        this.examForm.get('classId')?.disable();
        this.examForm.get('sectionId')?.disable();
      }
    });

    // Listen to exam changes
    this.examForm.get('examId')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged()
    ).subscribe(examId => {
      this.examForm.patchValue({ classId: '', sectionId: '' });
      this.results = [];
      this.subjects = [];
      this.unsavedChanges.clear();
      if (examId) {
        this.loadClasses(examId);
        this.examForm.get('classId')?.enable();
        this.examForm.get('sectionId')?.disable();
      } else {
        this.classes = [];
        this.examForm.get('classId')?.disable();
        this.examForm.get('sectionId')?.disable();
      }
    });

    // Listen to class changes
    this.examForm.get('classId')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged()
    ).subscribe(classId => {
      this.examForm.patchValue({ sectionId: '' });
      this.results = [];
      this.subjects = [];
      this.unsavedChanges.clear();
      if (classId) {
        this.loadSections(classId);
        this.examForm.get('sectionId')?.enable();
      } else {
        this.sections = [];
        this.examForm.get('sectionId')?.disable();
      }
    });


  }

  ngOnInit() {
    this.loadInitialData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInitialData() {
    this.loadBranches();
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
    const branchId = this.examForm.get('branchId')?.value;
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
          this.loading.classes = false;
        }
      });
  }

  loadSections(classId: number) {
    this.loading.sections = true;
    const payload = {
      classId: classId,
      branchId: this.examForm.get('branchId')?.value
    };  
    this.examService.getSectionsByClassAndBranch(payload)
      .pipe(finalize(() => this.loading.sections = false))
      .subscribe({
        next: (res: any) => {
          this.sections = res.data;
        },
        error: (error) => {
          console.error('Error loading sections:', error);
          this.snackBar.openSnackBar(error);
        }
      });
  }

  loadExamResults() {
    if (!this.examForm.valid) {
      return;
    }
    this.hasSearched = true;
    this.loading.submit = true;
    this.examService.getExamResults(this.examForm.value)
      .pipe(finalize(() => this.loading.submit = false))
      .subscribe({
        next: (res: any) => {
          const {data} = res;
          this.results = data.results;
          this.subjects = data.subjects;
          this.unsavedChanges.clear();
        },
        error: (error: any) => {
          console.error('Error loading results:', error);
          this.snackBar.openSnackBar(error);
          this.results = [];
          this.subjects = [];
        }
      });
  }

  getErrorMessage(field: string): string {
    if (this.examForm.get(field)?.hasError('required')) {
      return 'This field is required';
    }
    return '';
  }

  updateMarks(result: any, subjectId: number, event: any) {
    let marks = event.value;
    // Enforce min/max
    if (marks > 100) marks = 100;
    if (marks < 0) marks = 0;

    const key = `${result.studentId}-${subjectId}`;
    const originalValue = result[this.getSubjectName(subjectId)];

    if (marks !== originalValue) {
      this.unsavedChanges.set(key, {
        result,
        subjectId,
        marks,
        originalValue
      });
    } else {
      this.unsavedChanges.delete(key);
    }
    // Update the model for immediate UI feedback
    result[this.getSubjectName(subjectId)] = marks;
  }

  getSubjectName(subjectId: number): string {
    const subject = this.subjects.find(s => s.subject_id === subjectId);
    return subject ? subject.subject_name : '';
  }

  hasUnsavedChanges(): boolean {
    return this.unsavedChanges.size > 0;
  }

  saveAllMarks() {
    if (this.unsavedChanges.size === 0) {
      this.snackBar.openSnackBar('No changes to save');
      return;
    }

    this.loading.saving = true;
    const savePromises: Promise<any>[] = [];

    this.unsavedChanges.forEach((change, key) => {
      const { result, subjectId, marks } = change;
      const subjectIds = result.studentExamMarksSubjectIds ? result.studentExamMarksSubjectIds.split(',') : [];
      const subjectIndex = subjectIds.findIndex((id: any) => id == subjectId);
      const studentExamMarksId = result.studentExamMarksIds ? result.studentExamMarksIds.split(',')[subjectIndex] : null;
      
      const payload = {
        studentClassId: result.studentClassId,
        examId: result.examId,
        subjectId: subjectId,
        marks: marks
      };

      if (studentExamMarksId == null) {
        savePromises.push(this.addStudentExamResult(payload));
      } else {
        savePromises.push(this.updateStudentExamResult(payload, studentExamMarksId));
      }
    });

    Promise.all(savePromises)
      .then(() => {
        this.snackBar.openSnackBar('All marks saved successfully');
        this.unsavedChanges.clear();
        this.loadExamResults(); // Refresh to get updated IDs
      })
      .catch((error) => {
        console.error('Error saving marks:', error);
        this.snackBar.openSnackBar('Error saving some marks');
      })
      .finally(() => {
        this.loading.saving = false;
      });
  }

  private addStudentExamResult(payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.examService.addStudentExamResult(payload)
        .subscribe({
          next: (res: any) => {
            resolve(res);
          },
          error: (error: any) => {
            console.error('Error adding student exam result:', error);
            reject(error);
          }
        });
    });
  }

  private updateStudentExamResult(payload: any, studentExamMarksId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.examService.updateStudentExamResult(payload, studentExamMarksId)
        .subscribe({
          next: (res: any) => {
            resolve(res);
          },
          error: (error: any) => {
            console.error('Error updating student exam result:', error);
            reject(error);
          }
        });
    });
  }
}
