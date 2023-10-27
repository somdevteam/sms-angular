import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from '@shared/snackbar.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';
import { BranchService } from '../branch.service';

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
  ) {}

  displayedColumns: string[] = ['branchId', 'branchName', 'branchLocation', 'dateCreated', 'isActive'];
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

}
