import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { SnackbarService } from '@shared/snackbar.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';
import { BranchService } from '../branch.service';

@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.scss']
})
export class AddBranchComponent {

  branchForm: FormGroup;
  selectedFile: File  | undefined;
  breadscrums = [
    {
      title: 'Branch',
      items: ['Add Branch'],
      active: 'Branch',
    },
  ];

  constructor(
    private fb: UntypedFormBuilder,
    private snackBar: SnackbarService,
    private pageLoader: PageLoaderService,
    private BranchService: BranchService,
    ) {
    this.branchForm = this.fb.group({
      branchName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      branchLocation: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      branchLogo: [''],
      coverLogo: [''],
    });
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    this.pageLoader.showLoader();
    const payload = this.branchForm.value;
    console.log(this.selectedFile);
    
    // this.BranchService.createBranch(payload).subscribe({
    //   next :(res => {
    //     this.pageLoader.hideLoader()

    //   }),
    //   error: (error => {
    //     this.pageLoader.hideLoader()
    //     this.snackBar.errorDialog('',error)
    //   })
    // })
  }
    

}
