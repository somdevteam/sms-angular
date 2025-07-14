import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeesService } from '../fees.service';
import { SnackbarService } from '../../shared/snackbar.service';
import { PageLoaderService } from '../../layout/page-loader/page-loader.service';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-addfees',
  templateUrl: './addfees.component.html',
  styleUrls: ['./addfees.component.scss']
})
export class AddfeesComponent implements OnInit {
  searchForm!: FormGroup;
  paymentForm!: FormGroup;
  studentData: any = null;
  paymentTypes: any[] = [];
  paymentStates: any[] = [];
  months: any[] = [];
  showPaymentForm = false;
  students: any[] = [];

  constructor(
    private fb: FormBuilder,
    private feesService: FeesService,
    private snackBar: SnackbarService,
    private pageLoader: PageLoaderService,
    private dialog: MatDialog
  ) {
    this.initializeForms();
  }

  ngOnInit() {
    this.loadDropdownData();
  }

  private initializeForms() {
    this.searchForm = this.fb.group({
      searchType: ['', Validators.required],
      searchValue: ['', Validators.required]
    });

    this.paymentForm = this.fb.group({
      studentId: ['', Validators.required],
      studentClassId: [''],
      amount: ['', [Validators.required, Validators.min(0)]],
      selectedMonth: ['', Validators.required],
      paymentTypeId: ['', Validators.required],
      paymentStateId: ['', Validators.required],
      responsibleId: [''],
      rollNo: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      details: ['']
    });
  }

  private loadDropdownData() {
    this.pageLoader.showLoader();

    // Create separate subscriptions for each API call
    this.feesService.getAllPaymentTypes().subscribe({
      next: (response) => {
        this.paymentTypes = response.data || [];
      },
      error: (error) => {
        this.snackBar.dangerNotification('Error loading payment types');
      }
    });

    this.feesService.getAllPaymentStates().subscribe({
      next: (response) => {
        this.paymentStates = response.data || [];
      },
      error: (error) => {
        this.snackBar.dangerNotification('Error loading payment states');
      }
    });

    this.feesService.getAllMonths().subscribe({
      next: (response) => {
        this.months = response.data || [];
      },
      error: (error) => {
        this.snackBar.dangerNotification('Error loading months');
      },
      complete: () => {
        this.pageLoader.hideLoader();
      }
    });
  }

  onSearchTypeChange() {
    const searchControl = this.searchForm.get('searchValue');
    searchControl?.setValue('');
    this.showPaymentForm = false;
    this.studentData = null;
    this.students = [];
  }

  searchStudent() {
    if (this.searchForm.invalid) {
      this.snackBar.warningNotification('Please fill in all required fields');
      return;
    }

    const searchType = this.searchForm.get('searchType')?.value;
    const searchValue = this.searchForm.get('searchValue')?.value;

    this.pageLoader.showLoader();

    if (searchType === 'rollNumber') {
      this.feesService.getStudentsByRollNumber(searchValue).subscribe({
        next: (response) => {
          if (response?.data && response.data.length > 0) {
            this.students = response.data;
            if (this.students.length === 1) {
              this.onStudentSelect(this.students[0]);
            }
          } else {
            this.snackBar.warningNotification('No student found');
            this.students = [];
          }
          this.pageLoader.hideLoader();
        },
        error: (error) => {
          this.snackBar.dangerNotification(error?.error?.message || 'Error fetching student data');
          this.pageLoader.hideLoader();
          this.students = [];
        }
      });
    } else if (searchType === 'mobile') {
      this.feesService.getStudentsByResponsibleMobile(searchValue).subscribe({
        next: (response) => {
          if (response?.data && response.data.length > 0) {
            this.students = response.data;
          } else {
            this.snackBar.warningNotification('No students found for this guardian');
            this.students = [];
          }
          this.pageLoader.hideLoader();
        },
        error: (error) => {
          this.snackBar.dangerNotification(error?.error?.message || 'Error fetching guardian data');
          this.pageLoader.hideLoader();
          this.students = [];
        }
      });
    }
  }

  getStudentDisplayText(student: any): string {
    const fullName = `${student.firstname} ${student.middlename} ${student.lastname}`.trim();
    const className = student.studentClass?.[0]?.className || '';
    const sectionName = student.studentClass?.[0]?.sectionName || '';
    const rollNumber = student.rollNumber || '';

    return `${fullName} - Class: ${className} ${sectionName} (Roll No: ${rollNumber})`;
  }

  onStudentSelect(student: any) {
    this.handleStudentData(student);
  }

  private handleStudentData(student: any) {
    this.studentData = student;
    this.showPaymentForm = true;

    // Get the level fee from student data
    const levelFee = student.studentClass?.[0]?.levelFee || 0;

    this.paymentForm.patchValue({
      studentId: student.studentid,
      studentClassId: student.studentClass?.[0]?.studentClassId,
      rollNo: student.rollNumber.toString(),
      responsibleId: student.responsible?.responsibleid,
      amount: levelFee
    });

  }

  submitPayment() {
    if (this.paymentForm.invalid) {
      this.snackBar.warningNotification('Please fill in all required fields');
      return;
    }

    const paymentData: PaymentFormData = {
      ...this.paymentForm.value,
      rollNo: this.paymentForm.value.rollNo.toString(),
      amount: Number(this.paymentForm.value.amount),
      studentId: Number(this.paymentForm.value.studentId),
      studentClassId: Number(this.paymentForm.value.studentClassId),
      monthId: Number(this.paymentForm.value.selectedMonth.monthid),
      monthName: this.paymentForm.value.selectedMonth.monthname,
      paymentTypeId: Number(this.paymentForm.value.paymentTypeId),
      paymentStateId: Number(this.paymentForm.value.paymentStateId),
      responsibleId: Number(this.paymentForm.value.responsibleId),
      isAutomatedPayment:false
    };

    this.pageLoader.showLoader();
    this.feesService.createPayment(paymentData).subscribe({
      next: (response) => {
        this.snackBar.successNotification('Payment created successfully');
        if (response) {
          this.showReceipt(response);
        }
        this.resetForms();
        this.pageLoader.hideLoader();
      },
      error: (error) => {
        this.snackBar.dangerNotification(error?.error?.message || 'Error creating payment');
        this.pageLoader.hideLoader();
      }
    });
  }

  private showReceipt(paymentData: any) {
    // Implement receipt display logic
  }

  private resetForms() {
    this.searchForm.reset();
    this.paymentForm.reset();
    this.showPaymentForm = true;
    this.studentData = null;
    this.students = [];
  }

  getSearchPlaceholder(): string {
    const searchType = this.searchForm.get('searchType')?.value;
    return searchType === 'rollNumber' ? 'Enter Roll Number' :
           searchType === 'mobile' ? 'Enter Mobile Number' :
           'Select search type first';
  }
}

export interface PaymentFormData {
  studentId: number;
  studentClassId: number;
  amount: number;
  monthId: number;
  paymentTypeId: number;
  paymentStateId: number;
  responsibleId: number;
  rollNo: string;
  details?: string;
}
