import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AcademicService } from '../academic.service';
import { SnackbarService } from '@shared/snackbar.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';
import { AuthService, User } from '@core';

@Component({
  selector: 'app-academic-year',
  templateUrl: './academic-year.component.html',
  styleUrls: ['./academic-year.component.scss']
})
export class AcademicYearComponent implements OnInit {
  register?: FormGroup;

  breadscrums = [
    {
      title: 'Class',
      items: ['Create Class'],
      active: 'Class',
    },
  ];

  isBranchLoading:boolean = false
  isBranch:boolean = false
  userInfo!:User;

  academicData:any;
  isEdit:boolean = false;

  constructor(
    private fb: FormBuilder,
    private academicService:AcademicService,
    private snackBar: SnackbarService,
    private pageLoader: PageLoaderService,
    private authService: AuthService
    ) {
      this.userInfo = this.authService.currentUserValue;
      this.isBranch = this.userInfo.branch ? true : false;
    }

  ngOnInit() {
    this.registerForm()
    this.loadAcademicYears();
    // this.loadBranches()
  }


  registerForm() {
    this.register = this.fb.group({
      academicYear: ['', [Validators.required]],
    });
  }

  // loadBranches() {
  //   this.isBranchLoading = true
  //   this.academicService.getBranches().subscribe({
  //     next: (res) => {
  //       this.branchesList = res;
  //       this.isBranchLoading = false
  //     },
  //     error: (error) => {
  //       this.isBranchLoading = false
  //       this.snackBar.dangerNotification(error);
  //     },
  //   });
  // }

  loadAcademicYears() {
    this.academicService.getAcademicYear().subscribe({
      next: (res) => {
        this.academicData = res;
        console.log(res);
        
      },
      error: (error) => {
        this.snackBar.errorDialog('',error);
      },
    });
  }


  onRegister() {
    console.log('Form Value', this.register?.value);
    const payload = this.register?.value;
    this.pageLoader.showLoader()
    this.academicService.saveAcademicYear(payload).subscribe({
      next: (res) => {
        this.pageLoader.hideLoader()
        // this.register?.reset()
        // this.snackBar.dangerNotification(res);
      },
      error: (error) => {
        this.pageLoader.hideLoader()
        this.snackBar.errorDialog('',error);
      },
    });
    
  }

  viewAcademic(row: any) {
   
  }
  editAcademic(row: any) {
    this.isEdit = true
    this.register?.patchValue(row);
  }
  deleteAcademic(row: any) {
   
  }

}
