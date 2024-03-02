import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AcademicService } from '../academic.service';
import { SnackbarService } from '@shared/snackbar.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';
import { AuthService, User } from '@core';
import { MatDialog } from '@angular/material/dialog';
import { AcademicDialogComponent, DialogMode } from './academic-dialog/academic-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

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

  // academicData:any;
  isEdit:boolean = false;

  academicData!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private academicService:AcademicService,
    private snackBar: SnackbarService,
    private pageLoader: PageLoaderService,
    private authService: AuthService,
    private dialog: MatDialog
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
    this.pageLoader.showLoader()
    this.academicService.getAcademicYear().subscribe({
      next: (res) => {
        this.pageLoader.hideLoader()
        this.academicData = new MatTableDataSource(res);
        this.academicData.sort = this.sort;
        this.academicData.paginator = this.paginator;
        console.log(res);
        
      },
      error: (error) => {
        this.pageLoader.hideLoader()
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

  addAcademic() {
    const dialogRef = this.dialog.open(AcademicDialogComponent, {
      width: '400px',
      data: { mode: DialogMode.Add },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  editAcademic(row: any):void {
    // this.isEdit = true
    // this.register?.patchValue(row);
    const dialogRef = this.dialog.open(AcademicDialogComponent, {
      width: '400px',
      data: { mode: DialogMode.Edit, academic: row },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  assingBranch(row: any):void {

    const academicId = row.academicId;
    this.pageLoader.showLoader()
    this.academicService.findBranchesByAcademic(academicId).subscribe({
      next: (res) => {

        this.pageLoader.hideLoader()
        const dialogRef = this.dialog.open(AcademicDialogComponent, {
          width: '400px',
          data: { mode: DialogMode.AddBranch, academic: {academic:row,branches: res} },
        });
      
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
        
      },
      error: (error) => {
        this.pageLoader.hideLoader()
        this.snackBar.dangerNotification(error);
      },
    });

  }

  ViewBranch(row: any):void {

    const academicId = row.academicId;
    this.pageLoader.showLoader()
    this.academicService.getBranchesWithAcademicByAcademicId(academicId).subscribe({
      next: (res) => {

        this.pageLoader.hideLoader()
        const dialogRef = this.dialog.open(AcademicDialogComponent, {
          width: '50%',
          data: { mode: DialogMode.ViewBranch, academic: res },
        });
      
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
        
      },
      error: (error) => {
        this.pageLoader.hideLoader()
        this.snackBar.dangerNotification(error);
      },
    });
  }

  onSlideToggleChange(row: any) {
    const actionType = row.isActive ? 'Activate' : 'Deactivate';
    const academic = row.academicYear;
    const text = `Do you want to ${actionType} this ${academic}?`
    this.snackBar.showConfirmationDialog(text).then((confirmed) => {
      if (confirmed) {
        const academicId = row.academicId;
        const payload = {
          academicYear: row.academicYear,
          isActive: row.isActive
        }

        this.academicService.updateAcademicYear(academicId, payload).subscribe({
          next: (error => {

          }),
          error: (error) => {
            this.snackBar.dangerNotification(error)
            row.isActive = !row.isActive;
          }
        })
        
      } else {
        row.isActive = !row.isActive;
      }
    })
  }


}
