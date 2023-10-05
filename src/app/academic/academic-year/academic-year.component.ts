import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AcademicService } from '../academic.service';
import { SnackbarService } from '@shared/snackbar.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';

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

  branchesList: any;
  isBranchLoading:boolean = false

  constructor(
    private fb: FormBuilder,
    private academicService:AcademicService,
    private snackBar: SnackbarService,
    private pageLoader: PageLoaderService,
    ) {}

  ngOnInit() {
    this.registerForm()
    this.loadBranches()
  }


  registerForm() {
    this.register = this.fb.group({
      branch: ['', [Validators.required]],
      year: ['', [Validators.required]],
      description: [''],
    });
  }

  loadBranches() {
    this.isBranchLoading = true
    this.academicService.getBranches().subscribe({
      next: (res) => {
        this.branchesList = res;
        this.isBranchLoading = false
      },
      error: (error) => {
        this.isBranchLoading = false
        this.snackBar.dangerNotification(error);
      },
    });
  }


  onRegister() {
    console.log('Form Value', this.register?.value);
    const payload = {
      branchId: this.register?.value['branch'],
      academicname:  this.register?.value['year']
    }
    this.academicService.saveAcademicYear(payload).subscribe({
      next: (res) => {
        // this.register?.reset()
        // this.snackBar.dangerNotification(res);
      },
      error: (error) => {
        this.snackBar.dangerNotification(error);
      },
    });
    
  }

}
