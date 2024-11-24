import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FeesService } from '../fees.service';
import { SnackbarService } from '@shared/snackbar.service';
import { Student } from '../../student/student';

@Component({
  selector: 'app-addfees',
  templateUrl: './addfees.component.html',
  styleUrls: ['./addfees.component.scss'],
})
export class AddfeesComponent implements OnInit {
  breadscrums = [
    {
      title: 'Add Fees',
      items: ['Fees'],
      active: 'Add Fees',
    },
  ];
  feesForm!: UntypedFormGroup;
  paymentTypes: any[] = [];
  feeTypes: any[] = [];
  paymentStates: any[] = [];
  months: any[] = [];
  students: Student[] = [];
  selectedStudent: Student | null = null;
  studentPayments: any[] = [];

  constructor(
    private fb: UntypedFormBuilder,
    private feesService: FeesService,
    private snackBar: SnackbarService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadPaymentTypes();
    this.loadPaymentStates();
    this.loadMonths();
    this.loadFeetypes();
  }

  // Initialize the form with necessary fields and validation
  private initializeForm(): void {
    this.feesForm = this.fb.group({
      rollNo: ['', ],
      fullName: ['', ],
      fType: [''],
      department: [''],
      date: [''],
      invoiceNo: [''],
      pType: [''],
      status: [''],
      amount:[''],
      duration: [''],
      details: [''],
      studentClassId: [''],
      monthName: [''],
      mobile: [''],
      responsibleName: [''],
      responsibleTell: [''],
      responsibleAddress: [''],
      responsiblePhone: [''],
      studentId: [''],
      sectionId: [''],// Added for student selection
    });
  }

  // Load dropdown options for payment types
  private loadPaymentTypes(): void {
    this.feesService.getPaymentTypes().subscribe({
      next: (res) => (this.paymentTypes = res),
      error: (error) => this.handleError(error),
    });
  }

  // Load dropdown options for payment states
  private loadPaymentStates(): void {
    this.feesService.getPaymentStates().subscribe({
      next: (res) => (this.paymentStates = res),
      error: (error) => this.handleError(error),
    });
  }

  private loadFeetypes(): void {
    this.feesService.getFeeTypes().subscribe({
      next: (res) => (this.feeTypes = res),
      error: (error) => this.handleError(error),
    });
  }


  // Load dropdown options for months
  private loadMonths(): void {
    this.feesService.getMonths().subscribe({
      next: (res) => (this.months = res),
      error: (error) => this.handleError(error),
    });
  }

  // Handle searching responsible party by mobile number
  searchResponsibleByMobile(): void {
    const mobile = this.feesForm.get('mobile')?.value;
    if (!mobile) {
      console.warn('Mobile number is undefined or empty');
      return;
    }

    this.feesService.getResponsibleByMobile(mobile).subscribe({
      next: (responsible) => {
        if (responsible) {
          this.feesForm.patchValue({ responsibleName: responsible.responsiblename });
          this.feesForm.patchValue({ responsibleAddres: responsible.address });
          this.feesForm.patchValue({ responsiblePhone: responsible.phone });
          this.feesForm.patchValue({ responsibleTell: responsible.phone2 });
          this.loadStudents(responsible.responsibleid);
          this.selectedStudent = null; // Reset selected student when new responsible is searched
          this.feesForm.get('studentId')?.reset(); // Reset student dropdown
        }
      },
      error: (error) => this.handleError(error),
    });
  }

  // Load students based on the responsible ID
  private loadStudents(responsibleId: number): void {
    this.feesService.getStudentsByResponsible(responsibleId).subscribe({
      next: (students: Student[]) => (this.students = students),
      error: (error) => this.handleError(error),
    });
  }

  // Handle student selection and load details
  onStudentSelect(event: any): void {
    const studentId = event.value;

    // Find the selected student directly from the students array
    this.selectedStudent = this.students.find(student => student.studentid === studentId) || null;
    console.log(this.selectedStudent);
    // Load only the payment information based on the student's level
    // if (this.selectedStudent) {
    //   this.loadStudentPayments(this.selectedStudent.studentClass[0]?.studentClassId);
    // }
  }


  // Load selected student's details and payment information
  private loadStudentDetails(studentId: number): void {
    this.feesService.getStudentDetails(studentId).subscribe({
      next: (student: Student) => {
        this.selectedStudent = student;
        this.loadStudentPayments(student.studentClass[0].studentClassId);
      },
      error: (error) => this.handleError(error),
    });
  }

  // Load payment details based on student level
  private loadStudentPayments(level: number): void {
    this.feesService.getStudentPaymentsByLevel(level).subscribe({
      next: (payments) => (this.studentPayments = payments),
      error: (error) => this.handleError(error),
    });
  }

  // Submit form data
  onSubmit(): void {
    if (this.feesForm.invalid) {
      this.snackBar.dangerNotification('Please fill out all required fields.');
      return;
    }

    const formFees = this.feesForm.value;
    console.log(formFees);
    return;
    const payload = {
      studentClassId: formFees.studentClassId,
      sName: formFees.sName,
      paymentTypeId: formFees.pType,
      paymentStateId: formFees.status,
      rollNo: formFees.rollNo,
      amount: formFees.amount,
      description: formFees.details,
      monthName: formFees.monthName,
    };

    this.feesService.createPayment(payload).subscribe({
      next: (res) => {
        this.snackBar.successNotification('Fees added successfully.');
        this.feesForm.reset();
      },
      error: (error) => this.handleError(error),
    });
  }

  // Centralized error handling
  private handleError(error: any): void {
    console.error(error);
    this.snackBar.dangerNotification('An error occurred. Please try again.');
  }
}
