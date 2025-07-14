import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchService } from 'app/branch/branch.service';
import { AcademicService } from 'app/academic/academic.service';

@Component({
  selector: 'app-add-student-attendance',
  templateUrl: './add-student-attendance.component.html',
  styleUrls: ['./add-student-attendance.component.scss']
})
export class AddStudentAttendanceComponent implements OnInit {
  breadscrums = [
    {
      title: 'Attendance',
      items: ['Attendance'],
      active: 'Add Student Attendance'
    }
  ];

  attendanceForm: FormGroup;
  branches: any[] = [];
  classes: any[] = [];
  sections: any[] = [];
  loading = {
    branches: false,
    classes: false,
    sections: false,
    submit: false
  };

  constructor(
    private fb: FormBuilder,
    private branchService: BranchService,
    private academicService: AcademicService
  ) {
    this.attendanceForm = this.fb.group({
      branchId: ['', Validators.required],
      classId: [{ value: '', disabled: true }, Validators.required],
      sectionId: [{ value: '', disabled: true }, Validators.required]
    });
  }

  ngOnInit() {
    this.loadBranches();
    this.attendanceForm.get('branchId')?.valueChanges.subscribe(branchId => {
      this.attendanceForm.patchValue({ classId: '', sectionId: '' });
      this.classes = [];
      this.sections = [];
      if (branchId) {
        this.loadClasses(branchId);
        this.attendanceForm.get('classId')?.enable();
        this.attendanceForm.get('sectionId')?.disable();
      } else {
        this.attendanceForm.get('classId')?.disable();
        this.attendanceForm.get('sectionId')?.disable();
      }
    });
    this.attendanceForm.get('classId')?.valueChanges.subscribe(classId => {
      this.attendanceForm.patchValue({ sectionId: '' });
      this.sections = [];
      if (classId) {
        this.loadSections(classId);
        this.attendanceForm.get('sectionId')?.enable();
      } else {
        this.attendanceForm.get('sectionId')?.disable();
      }
    });
  }

  loadBranches() {
    this.loading.branches = true;
    this.branchService.getBranches().subscribe({
      next: (data) => {
        this.branches = data;
        this.loading.branches = false;
      },
      error: () => {
        this.loading.branches = false;
      }
    });
  }

  loadClasses(branchId: number) {
    this.loading.classes = true;
    this.academicService.findClassNotInLevelWithBranch(branchId).subscribe({
      next: (data) => {
        this.classes = data;
        this.loading.classes = false;
      },
      error: () => {
        this.loading.classes = false;
      }
    });
  }

  loadSections(classId: number) {
    this.loading.sections = true;
    const payload = { classId };
    this.academicService.findSectionsByFilter(payload).subscribe({
      next: (data) => {
        this.sections = data;
        this.loading.sections = false;
      },
      error: () => {
        this.loading.sections = false;
      }
    });
  }

  onSearch() {
    // Implement search logic or emit event here
    // You can access form values with this.attendanceForm.value
  }
}
