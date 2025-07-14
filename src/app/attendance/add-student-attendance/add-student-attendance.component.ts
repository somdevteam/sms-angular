import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchService } from 'app/branch/branch.service';
import { AcademicService } from 'app/academic/academic.service';
import { StudentsService } from 'app/student/students.service';
import { SnackbarService } from '@shared/snackbar.service';

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
  students: any[] = [];
  attendanceRecords: any[] = [];
  public today: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private branchService: BranchService,
    private academicService: AcademicService,
    private studentService: StudentsService,
    private snackbarService: SnackbarService
  ) {
    this.attendanceForm = this.fb.group({
      branchId: ['', Validators.required],
      classId: [{ value: '', disabled: true }, Validators.required],
      sectionId: [{ value: '', disabled: true }, Validators.required],
      attendanceDate: [new Date(), Validators.required]
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
      error: (err) => {
        this.loading.branches = false;
        this.snackbarService.openSnackBar(err);

      }
    });
  }

  loadClasses(branchId: number) {
    this.loading.classes = true;
    this.academicService.getClassesByBranchId(branchId).subscribe({
      next: (data) => {
        this.classes = data;
        this.loading.classes = false;
      },
      error: (err) => {
        this.loading.classes = false;
        this.snackbarService.openSnackBar(err);
        
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
      error: (err) => {
        this.loading.sections = false;
        this.snackbarService.openSnackBar(err);

      }
    });
  }

  onSearch() {
    const payload = {
      branchId: this.attendanceForm.get('branchId')?.value,
      classId: this.attendanceForm.get('classId')?.value,
      sectionId: this.attendanceForm.get('sectionId')?.value,
    };
    this.studentService.getStudentsByClassAndSectionWithBranch(payload).subscribe({
      next: (res => {
        // Assuming res.data is the array of students
        this.students = res || [];
        this.attendanceRecords = this.students.map(student => ({
          studentId: student.studentId,
          studentClassId: student.studentClassId,
          rollNumber: student.rollNumber,
          name: `${student.firstName} ${student.middleName || ''} ${student.lastName}`.replace(/  +/g, ' ').trim(),
          status: 'present',
          desc: ''
        }));
      }),
      error: (err => {
        this.snackbarService.openSnackBar(err);
        console.log(err);
      })
    })
  }

  onStatusChange(studentId: number, status: string) {
    const record = this.attendanceRecords.find(r => r.studentId === studentId);
    if (record) {
      record.status = status;
    }
  }

  onDescChange(studentId: number, desc: string) {
    const record = this.attendanceRecords.find(r => r.studentId === studentId);
    if (record) {
      record.desc = desc;
    }
  }

  onSaveAttendance() {
    this.loading.submit = true;
    const payload = {
      branchId: this.attendanceForm.get('branchId')?.value,
      classId: this.attendanceForm.get('classId')?.value,
      sectionId: this.attendanceForm.get('sectionId')?.value,
      attendanceDate: this.attendanceForm.get('attendanceDate')?.value,
      attendance: this.attendanceRecords.map(record => ({
        studentId: record.studentId,
        studentClassId: record.studentClassId,
        status: record.status,
        desc: record.desc
      }))
    };
    // Call your service to save attendance (implement saveAttendance in your service)
    this.studentService.saveAttendance(payload).subscribe({
      next: (res) => {
        this.loading.submit = false;
        this.snackbarService.openSnackBar('Attendance saved successfully!');
        // Show a success message or reset form as needed
      },
      error: (err) => {
        this.loading.submit = false;
        this.snackbarService.openSnackBar(err);
        // Show an error message
      }
    });
  }
}
