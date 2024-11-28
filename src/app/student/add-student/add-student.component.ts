import { Component } from '@angular/core';
import {AuthService, User} from "@core";
import {Permissions} from "@shared/enums/permissions.enums";
import {SnackbarService} from "@shared/snackbar.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StudentsService} from "../students.service";

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent {
  studentForm!: FormGroup;
  levelList: any;
  classList: any;
  sectionList: any = []
  breadscrums = [
    {
      title: 'Add Student',
      items: ['Student'],
      active: 'Add Student',
    },
  ];

  hide = true;
  branchesList:any = []
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
      responsibleName: ['',Validators.required],
      responsiblePhone: ['',Validators.required],
      classId:  ['', Validators.required],
      isActive: ['1'],
      sectionId: [],
      rollNumber: ['', Validators.required]
    }
    this.studentForm = this.fb.group(formFields );

    // this.loadRoles()
    this.loadBranches()
  }

  loadBranches() {
    this.studentsService.getBranches().subscribe({
      next:(res => {
        this.branchesList = res
      }),
      error: (error => {
        this.snackBar.dangerNotification(error)
      })
    })
  }

  onSubmit() {
    if(this.studentForm.valid){
      const payload = this.studentForm.value;
      payload.rollNumber = Number(payload.rollNumber);
      console.log(payload);
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
