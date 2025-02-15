import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FeesService } from '../fees.service';
import { SnackbarService } from '@shared/snackbar.service';
import { Student } from '../../student/student';
import {MatDialog} from "@angular/material/dialog";
import {PaymentConfirmationDialogComponent} from "../payment-confirmation-dialog/payment-confirmation-dialog.component";
import {ReceiptComponent} from "../receipt/receipt.component";

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
  pendingPayments: any[] = [];
  filteredStudents: any[] = [];
  private responsibleParty: any;


  constructor(
    private fb: UntypedFormBuilder,
    private feesService: FeesService,
    private snackBar: SnackbarService,
    private dialog: MatDialog
  ) {
    this.feesForm = this.fb.group({
      rollNo: ['', ],
      fullName: ['', ],
      fType: [''],
      department: [''],
      date: [''],
      invoiceNo: [''],
      pType: [''],
      paymentState: [''],
      amount:[''],
      duration: [''],
      details: [''],
      studentClassId: [''],
      monthName: [''],
      monthId:[''],
      mobile: [''],
      responsibleName: [''],
      responsibleTell: [''],
      responsibleAddress: [''],
      responsiblePhone: [''],
      responsibleId:[''],
      studentId: [''],
      sectionId: [''],
      className:[''],
      sectionName:[''],
      levelName:['']// Added for student selection
    });
    // this.initializeForm();
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
      sectionId: [''],
      className:[''],
      sectionName:[''],
      levelName:['']// Added for student selection
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
          this.feesForm.patchValue({ responsibleId: responsible.responsibleid });
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
    this.feesForm.patchValue({ fullName: this.selectedStudent?.fullName });
    this.feesForm.patchValue({ rollNo: this.selectedStudent?.rollNumber });
    this.feesForm.patchValue({ sectionName: this.selectedStudent?.studentClass[0].sectionName });
    this.feesForm.patchValue({ className: this.selectedStudent?.studentClass[0].className});
    this.feesForm.patchValue({ levelName: this.selectedStudent?.studentClass[0].levelName});
    this.feesForm.patchValue({ amount: this.selectedStudent?.studentClass[0].levelFee});
    this.feesForm.patchValue({ studentClassId: this.selectedStudent?.studentClass[0].studentClassId});
    this.feesForm.patchValue({ studentId: this.selectedStudent?.studentid});
    console.log(this.selectedStudent);
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
   // payment.sName = this.selectedStudent.fullName;
    const payload = {
      studentClassId: formFees.studentClassId,
      fullName: formFees.fullName,
      paymentTypeId: formFees.pType,
      paymentStateId: formFees.paymentState,
      rollNo: formFees.rollNo,
      amount: formFees.amount,
      description: formFees.details,
      monthName: formFees.monthName,
      studentid:formFees.studentId,
      responsibleId:formFees.responsibleId,
      monthId:formFees.monthId,
      className:formFees.className,
      sectionName:formFees.sectionName,
      levelName:formFees.levelName


    };
    // Add the current payment to the pending list
    this.pendingPayments.push(payload);
    console.log("pending payments");
    console.log(this.pendingPayments);

    // Reset form for another payment
   // this.feesForm.reset();
   // this.selectedStudent = null;
    this.students = this.students.filter(
      student => student.studentid !== this.selectedStudent?.studentid,

    );
  if (this.students){
    this.feesForm.patchValue({ fullName: null });
    this.feesForm.patchValue({ rollNo: null });
    this.feesForm.patchValue({ sectionName: null });
    this.feesForm.patchValue({ className: null});
    this.feesForm.patchValue({ levelName:null});
    this.feesForm.patchValue({ amount: null});
    this.feesForm.patchValue({ studentClassId: null});
    this.feesForm.patchValue({ studentId: null})
  }

    // Show confirmation dialog
    const dialogRef = this.dialog.open(PaymentConfirmationDialogComponent, {
      data: { payments: this.pendingPayments }
    });

    // Subscribe to the dialog result after it closes
    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'create') {
        this.createPayments();  // Call the createPayments method when 'create' action is selected
      } else if (result?.action === 'add') {
        this.addAnotherPayment();  // Handle add another payment if selected
      } else if (result?.action === 'remove') {
        this.pendingPayments = this.pendingPayments.filter(p => p !== result.payment);
      }
    });

  }

  createPayments(): void {
    if (this.pendingPayments.length === 0) {
      this.snackBar.dangerNotification('No payments to create.');
      return;
    }
    console.log("array of pending payment ");
    console.log(this.pendingPayments);
    this.feesService.createMultiplePayments(this.pendingPayments).subscribe({
      next: (response) => {
        this.snackBar.successNotification('Payments created successfully.');
        this.dialog.open(ReceiptComponent, {
          data: {
            payments: response.receipts,
            responsibleParty: null
          },
          width: '800px'
        });
        this.pendingPayments = [];
       // this.dialog.closeAll();
      },
      error: () => this.snackBar.dangerNotification('Failed to create payments.'),
    });




    // const formFees = this.feesForm.value;
    // console.log("form fees");
    // console.log(formFees);



    // const payload = {
    //   studentClassId: formFees.studentClassId,
    //   sName: formFees.sName,
    //   paymentTypeId: formFees.pType,
    //   paymentStateId: formFees.paymentState,
    //   rollNo: formFees.rollNo,
    //   amount: formFees.amount,
    //   description: formFees.details,
    //   monthName: formFees.monthName,
    //   studentid:formFees.studentId,
    //   responsibleId:formFees.responsibleId,
    //   monthId:formFees.monthId,
    //   className:formFees.className,
    //   sectionName:formFees.sectionName,
    //   levelName:formFees.levelName
    //
    //
    // };

    // this.feesService.createPayment(payload).subscribe({
    //   next: (res) => {
    //     this.snackBar.successNotification('Fees added successfully.');
    //     this.feesForm.reset();
    //   },
    //   error: (error) => this.handleError(error),
    // });
  }

  // Centralized error handling
  private handleError(error: any): void {
    console.error(error);
    this.snackBar.dangerNotification('An error occurred. Please try again.');
  }

  addAnotherPayment(): void {
    this.dialog.closeAll();
  }
}
