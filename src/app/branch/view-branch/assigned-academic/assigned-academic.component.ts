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

  displayedColumns: string[] = ['academicBranchId','academicYear','dateCreated','isActive'];
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
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.value) {
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }else {
        row.isActive = !row.isActive;
      }
    });
  }

}
