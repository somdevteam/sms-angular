import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from '@shared/snackbar.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';
import { BranchService } from '../branch.service';
import { MatDialog } from '@angular/material/dialog';
import { AssignedAcademicComponent } from './assigned-academic/assigned-academic.component';

@Component({
  selector: 'app-view-branch',
  templateUrl: './view-branch.component.html',
  styleUrls: ['./view-branch.component.scss']
})
export class ViewBranchComponent implements OnInit {

  breadscrums = [
    {
      title: 'Branch',
      items: ['View Branch'],
      active: 'Branch',
    },
  ];

  constructor(
    private snackBar: SnackbarService,
    private pageLoader: PageLoaderService,
    private branchService: BranchService,
    private dialog: MatDialog,
  ) {}

  displayedColumns: string[] = ['branchId', 'branchName', 'branchLocation', 'dateCreated', 'isActive','action'];
  dataSource = new MatTableDataSource<any>; 

  ngOnInit(): void {
    this.loadBranches()
  }

  loadBranches() {
    this.pageLoader.showLoader();
    this.branchService.getBranches().subscribe({
      next :(res => {
        console.log(res);
        
        this.dataSource = new MatTableDataSource(res);
        this.pageLoader.hideLoader()

      }),
      error: (error => {
        this.pageLoader.hideLoader()
        this.snackBar.errorDialog('',error)
      })
    })
  }

  onSlideToggleChange(row: any) {
    const branchId = row.branchId;
    const actionType = row.isActive ? 'Activate' : 'Deactivate';
    const branch = row.branchName;
    const text = `Do you want to ${actionType} this ${branch}?`
    this.snackBar.showConfirmationDialog(text).then((confirmed) => {
      if (confirmed) {
        this.branchService.activateBranch(branchId).subscribe({
          next: (_ => {
            this.loadBranches()
          }),
          error: (error => {
            this.snackBar.dangerNotification(error)
          })
        })
      } else {
        row.isActive = !row.isActive;
      }
    })
  }

  assignedAcademic(row: any) {
    this.dialog.open(AssignedAcademicComponent, {
      data: {
        branchId: row.branchId
      },
      width: '70%'
    })
  }

}
