import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '@core';
import { User } from '@core/models/user';
import { SnackbarService } from '@shared/snackbar.service';
import { AcademicService } from 'app/academic/academic.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';
import { AssingClassComponent } from '../assing-class/assing-class.component';

@Component({
  selector: 'app-view-class',
  templateUrl: './view-class.component.html',
  styleUrls: ['./view-class.component.scss']
})
export class ViewClassComponent implements OnInit {
  viewClassForm?:FormGroup
  userInfo:User
  isBranch:boolean = false
  branchesList:any = []
  isBranchLoading:boolean = false

  classList:any 
  displayedColumns: string[] = ['classid', 'classname','actions'];

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
    this.isBranch = this.userInfo.branch ? true : false;
  }

  ngOnInit() {
    this.viewClassForm = this.formBuilder.group({
      branch: ['',this.isBranch ? Validators.nullValidator :Validators.required],
     });

    this.isBranch ?  this.onSelectionChange(this.userInfo.branch) : this.loadBranches()
  }

  closeDialog(){
    this.dialogRef.close();
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

  onSelectionChange(selectedBranchId:any) {
    const payload = {
      branchId: selectedBranchId,
      levelId: this.data.levelid
    }

    this.pageLoader.showLoader()
    this.academicService.findClassesByBranchIdAndLevel(payload).subscribe({
      next:(res => {
        this.classList = res;
        
        this.pageLoader.hideLoader()
      }),
      error: (error => {
        this.pageLoader.hideLoader()
        this.snackBar.dangerNotification(error)
      })
    }) 
  }
  removeClass(row:any) {
    const levelClassId = row.levelclassid
    this.pageLoader.showLoader()
    this.academicService.deleteLevelClassById(levelClassId).subscribe({
      next:(res => {
        this.closeDialog()
        this.pageLoader.hideLoader()
      }),
      error: (error => {
        this.pageLoader.hideLoader()
        this.snackBar.dangerNotification(error)
      })
    }) 
  }


}
