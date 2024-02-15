import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@core';
import { SnackbarService } from '@shared/snackbar.service';
import { BranchService } from 'app/branch/branch.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss'],
})
export class ClassComponent implements OnInit {

  constructor(
    private fb: UntypedFormBuilder,
    private branchService: BranchService,
    private snackBar: SnackbarService,
    private pageLoader: PageLoaderService,
    private dialog: MatDialog,
    private authService:AuthService

  ) {

  }
  
  breadscrums = [
    {
      title: 'Class',
      items: ['List Class'],
      active: 'Class',
    },
  ];
  branchesList: any;
  classForm?: FormGroup;
  selectedStatus: '0' | '1' = '1';

  ngOnInit(): void {
    let formFields = {
      branchId: ['', [Validators.required]],
      isActive: ['1'],
    };
    this.classForm = this.fb.group(formFields)

    this.loadBranches()

  }

  loadBranches() {
    this.branchService.getBranches().subscribe({
      next:(res) => {
        this.branchesList = res;
      },
      error:(error) => {
        this.snackBar.dangerNotification(error);
     }
    })
  }



  onSubmit() {}
}
