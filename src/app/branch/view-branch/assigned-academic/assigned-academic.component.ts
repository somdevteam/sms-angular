import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from '@shared/snackbar.service';
import { BranchService } from 'app/branch/branch.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assigned-academic',
  templateUrl: './assigned-academic.component.html',
  styleUrls: ['./assigned-academic.component.scss']
})
export class AssignedAcademicComponent implements OnInit {

  displayedColumns: string[] = ['academicBranchId','branchName','academicYear','dateCreated','isActive'];
  dataSource = new MatTableDataSource<any>; 



  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { branchId: number },
    private branchService: BranchService,
    private pageLoader: PageLoaderService,
    private snackbar: SnackbarService,
    public dialogRef: MatDialogRef<AssignedAcademicComponent>,
  ) {}

  ngOnInit(): void {
    const branchId = this.data.branchId;
    this.pageLoader.showLoader();
    this.branchService.getAssignedAcademicByBranch(branchId).subscribe({
      next: (res => {
        this.pageLoader.hideLoader()
        this.dataSource = new MatTableDataSource(res);
      }),
      error: (error => {
        this.pageLoader.hideLoader();
        this.snackbar.errorDialog('Error',error);
      })
    })
  }

  onSlideToggleChange(row: any) {
    const actionType = row.isActive ? 'Activate' : 'Deactivate';
    const academic = row.academic.academicYear;
    const text = `Do you want to ${actionType} this ${academic}?`
    this.snackbar.showConfirmationDialog(text).then((confirmed) => {
      if (confirmed) {
        const payload = {
          academicId : row.academic.academicId,
          branchId: this.data.branchId
        };
        this.pageLoader.showLoader();
        this.branchService.activeAndDeactivateBranchAcademic(payload).subscribe({
          next: (res => {
            this.pageLoader.hideLoader();
          }),
          error: (error => {
            this.pageLoader.hideLoader();
            this.snackbar.errorDialog('Error',error)
          })
        })

      } else {
        row.isActive = !row.isActive;
      }
    });
  }

}
