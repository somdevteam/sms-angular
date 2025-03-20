import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { BranchService } from 'app/branch/branch.service';
import { SnackbarService } from '@shared/snackbar.service';
import { ExamsService } from '../exams.service';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

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
    submit: false
  };
  results: any[] = [];
  subjects: any[] = [];
  value1!: number;

  private marksUpdate = new Subject<{result: any, subjectId: number, marks: number}>();
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
    this.examForm.get('branchId')?.valueChanges.subscribe(branchId => {
      this.examForm.patchValue({ examId: '', classId: '', sectionId: '' });
      if (branchId) {
        this.loadExams();
      } else {
        this.exams = [];
        this.examForm.get('classId')?.disable();
        this.examForm.get('sectionId')?.disable();
      }
    });

    // Listen to exam changes
    this.examForm.get('examId')?.valueChanges.subscribe(examId => {
      this.examForm.patchValue({ classId: '', sectionId: '' });
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
    this.examForm.get('classId')?.valueChanges.subscribe(classId => {
      this.examForm.patchValue({ sectionId: '' });
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
    
    // Set up marks update subscription with debounce
    this.marksUpdate.pipe(
      debounceTime(1000),
      takeUntil(this.destroy$)
    ).subscribe(({result, subjectId, marks}) => {
      // console.log(marks);
      const subjectIds = result.studentExamMarksSubjectIds ? result.studentExamMarksSubjectIds.split(',') : [];

      const subjectIndex = subjectIds.findIndex((id: any) => id == subjectId);

      const studentExamMarksId = result.studentExamMarksIds ? result.studentExamMarksIds.split(',')[subjectIndex] : null;
      console.log(studentExamMarksId);
      if (studentExamMarksId == null) {
        const payload = {
          studentClassId: result.studentClassId,
          examId: result.examId,
          subjectId: subjectId,
          marks: marks
        }
        this.addStudentExamResult(payload);
      } else {
        const payload = {
          studentClassId: result.studentClassId,
          examId: result.examId,
          subjectId: subjectId,
          marks: marks
        }
        this.updateStudentExamResult(payload, studentExamMarksId);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
    if (!this.examForm.valid) {
      return;
    }
    console.log(this.examForm.value);
    this.loading.submit = true;
    this.examService.getExamResults(this.examForm.value)
      .pipe(finalize(() => this.loading.submit = false))
      .subscribe({
        next: (res: any) => {
          const {data} = res;
          this.results = data.results;
          this.subjects = data.subjects;
          console.log(this.results);
          console.log(this.subjects);
          
        },
        error: (error: any) => {
          console.error('Error loading results:', error);
          this.snackBar.openSnackBar(error);
        }
      });
  }

  updateMarks(result: any, subjectId: number, event: any) {
    const marks = event.value;
    this.marksUpdate.next({ result, subjectId, marks });
  }

  addStudentExamResult(payload: any) {
    
    this.examService.addStudentExamResult(payload)
      .subscribe({
        next: (res: any) => {
          this.snackBar.openSnackBar(res.message);
        },
        error: (error: any) => {
          console.error('Error adding student exam result:', error);
          this.snackBar.openSnackBar(error);
        }
      });
  }

  
  updateStudentExamResult(payload: any,studentExamMarksId: number) {
  
    this.examService.updateStudentExamResult(payload, studentExamMarksId)
      .subscribe({
        next: (res: any) => {
          this.snackBar.openSnackBar(res.message);
        },
        error: (error: any) => {
          console.error('Error updating student exam result:', error);
          this.snackBar.openSnackBar(error);
        }
      });
  }
}
