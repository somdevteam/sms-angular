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
    this.branchService.activateBranch(branchId).subscribe({
      next: (res => {
        this.loadBranches()
      }),
      error: (error => {
        this.snackBar.dangerNotification(error)
      })
    }) 
  }

  assignedAcademic(row: any) {
    this.dialog.open(AssignedAcademicComponent)
  }

}
