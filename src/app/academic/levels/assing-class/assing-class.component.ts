import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '@core';
import { AuthService } from '@core/service/auth.service';
import { SnackbarService } from '@shared/snackbar.service';
import { AcademicService } from 'app/academic/academic.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';

@Component({
  selector: 'app-assing-class',
  templateUrl: './assing-class.component.html',
  styleUrls: ['./assing-class.component.scss']
})
export class AssingClassComponent implements OnInit {

  assignForm?:FormGroup
  userInfo:User
  branchesList:any = []
  classesList: any = []
  isBranchLoading:boolean = false
  isClassLoading:boolean = false

  constructor(
    public dialogRef: MatDialogRef<AssingClassComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private academicService:AcademicService,
    private snackBar: SnackbarService,
    private pageLoader: PageLoaderService,
    private authService:AuthService

    ) {
      this.userInfo = this.authService.currentUserValue;
    }

  ngOnInit() {
    this.assignForm = this.formBuilder.group({
      branch: ['', Validators.required],
      class: ['',Validators.required],
      level: [this.data.levelname]
     });

     this.loadBranches()
  }

  closeDialog(){
    this.dialogRef.close();
  }

  onSelectionChange(selectedBranchId: any): void {
    this.isClassLoading = true
    this.academicService.findClassNotInLevelWithBranch(selectedBranchId).subscribe({
      next:(res => {
        this.classesList = res
        this.isClassLoading = false
      }),
      error: (error => {
        this.isClassLoading = false
        this.snackBar.dangerNotification(error)
      })
    })
    
  }

  loadBranches() {
    this.isBranchLoading = true
    this.academicService.getBranches().subscribe({
      next:(res => {
        this.branchesList = res
        this.isBranchLoading = false
      }),
      error: (error => {
        this.isBranchLoading = false
        this.snackBar.dangerNotification(error)
      })
    })
  }

  onSubmit() {
    const payload = {
      "levelid": this.data.levelid,
      "branchid":  this.assignForm?.controls['branch'].value,
      "classid": this.assignForm?.controls['class'].value,
    };
    this.pageLoader.showLoader()
    this.academicService.assingLevelClasses(payload).subscribe({
      next:(res => {
        this.classesList = res
        this.pageLoader.hideLoader()
        this.closeDialog()
      }),
      error: (error => {
        this.pageLoader.hideLoader()
        this.snackBar.dangerNotification(error)
      })
    })
  }

}
