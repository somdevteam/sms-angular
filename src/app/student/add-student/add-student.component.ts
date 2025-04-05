import { Component } from '@angular/core';
import {AuthService, User} from "@core";
import {Permissions} from "@shared/enums/permissions.enums";
import {SnackbarService} from "@shared/snackbar.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StudentsService} from "../students.service";
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent {
  studentForm!: FormGroup;
  levelList: any;
  classList: any;
  sectionList: any = [];
  filteredResponsibles: any[] = [];
  breadscrums = [
    {
      title: 'Add Student',
      items: ['Student'],
      active: 'Add Student',
    },
  ];

  hide = true;
  branchesList:any = []
  studentTypes:any = []
  rolesList:any = []
  selectedBranch: any;
  isBranch:boolean = false
  userInfo!:User;
  permissions = Permissions.userManagement.users;

  constructor(
    private studentsService:StudentsService,
    private snackBar:SnackbarService,
    private route: ActivatedRoute,
    private fb :FormBuilder,
    private router: Router,
    public authService: AuthService
  ) {
    this.userInfo = this.authService.currentUserValue;
    this.isBranch = this.userInfo.branch ? true : false;
  }

  get f() {
    return this.studentForm.controls;
  }

  ngOnInit(): void {
    let formFields = {
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      middleName: [''],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      pob: ['', [Validators.required]],
      branchId: [''],
      gender: ['M', [Validators.required, Validators.pattern(/^(M|F)$/i)]],
      dateOfBirth: ['', Validators.required],
      responsibleType: ['new'],
      existingResponsible: [''],
      responsibleName: [''],
      responsiblePhone: [''],
      classId:  ['', Validators.required],
      isActive: ['1'],
      sectionId: [],
      rollNumber: ['', Validators.required],
      studentType: [null]
    }
    this.studentForm = this.fb.group(formFields);

    // Set up guardian search
    this.studentForm.get('existingResponsible')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(value => {
          if (typeof value === 'string' && value) {
            return this.searchResponsibles(value);
          }
          return of([]);
        })
      )
      .subscribe(responsibles => {
        this.filteredResponsibles = responsibles;
      });

    this.loadInitialData();
  }

  displayResponsibleFn(responsible: any): string {
    return responsible ? `${responsible.responsiblename} - ${responsible.phone}` : '';
  }

  private searchResponsibles(query: string): Observable<any[]> {
    return this.studentsService.searchResponsibles(query);
  }

  loadInitialData() {

    this.studentsService.getBranches().subscribe({
      next:(res => {
        this.branchesList = res
      }),
      error: (error => {
        this.snackBar.dangerNotification(error)
      })
    })

    this.studentsService.getStudentTypes().subscribe({
      next: (res) => {
        this.studentTypes = res;
        this.studentForm.get('studentType')?.setValue(this.studentTypes[0]?.id);
      }
    })
  } 

  onSubmit() {
    if(this.studentForm.valid){
      const formValue = this.studentForm.value;
      const payload: any = {
        firstName: formValue.firstName,
        middleName: formValue.middleName,
        lastName: formValue.lastName,
        pob: formValue.pob,
        branchId: formValue.branchId,
        gender: formValue.gender,
        dateOfBirth: formValue.dateOfBirth,
        classId: formValue.classId,
        isActive: formValue.isActive,
        sectionId: formValue.sectionId,
        rollNumber: Number(formValue.rollNumber),
        responsibleType: formValue.responsibleType,
        studentType: formValue.studentType,
        studentTypeId: formValue.studentType
      };

      if (formValue.responsibleType === 'new') {
        payload.responsibleName = formValue.responsibleName;
        payload.responsiblePhone = formValue.responsiblePhone;
      } else {
        const selectedResponsible = formValue.existingResponsible;
        payload.responsibleId = selectedResponsible.responsibleid;
      }
      this.studentsService.addStudent(payload).subscribe({
        next: (res => {
          this.router.navigateByUrl('student/students')
        }),
        error: (error => {
          this.snackBar.dangerNotification(error)
        })
      })
    }
  }

  onBranchChange(branchId: any) {
    const payload = {
      branchId: branchId
    }
    this.studentsService.findClassByBranchId(payload).subscribe({
      next:(res) => {
        this.classList = res;
      },
      error:(error) => {
        this.snackBar.dangerNotification(error);
      }
    })
  }

  onClassChange() {
    const payload = {
      classId: this.studentForm?.controls['classId'].value,
      branchId: this.studentForm?.controls['branchId'].value,
      isActive: this.studentForm?.controls['isActive'].value
    }
    this.studentsService.findSectionsByFilter(payload).subscribe({
      next: (res) => {
        this.sectionList = res;
      },
      error: (error) => {
        this.snackBar.dangerNotification(error);
      }
    })
  }
}
