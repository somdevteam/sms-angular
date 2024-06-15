import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { SnackbarService } from '@shared/snackbar.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';
import { ExamsService } from '../exams.service';
import { UserService } from 'app/users/user.service';

@Component({
  selector: 'app-add-exam',
  templateUrl: './add-exam.component.html',
  styleUrls: ['./add-exam.component.scss']
})
export class AddExamComponent implements OnInit {
  examForm!: FormGroup;
  breadscrums = [
    {
      title: 'Branch',
      items: ['Add Branch'],
      active: 'Branch',
    },
  ];

  examList: any = [];
  branchesList: any = [];
  today: Date = new Date();

  constructor(
    private fb: UntypedFormBuilder,
    private snackBar: SnackbarService,
    private pageLoader: PageLoaderService,
    private examService: ExamsService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.examForm = this.fb.group({
      branch: ['', [Validators.required]],
      exam: ['', [Validators.required]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
    });

    this.loadBranches();
    this.loadExams();
  }

  loadExams() {
    this.examService.getExams().subscribe({
      next: (res => {
        this.examList = res;
      }),
      error: (error => {
        this.snackBar.errorDialog('', error)
      })
    })
  }
  loadBranches() {
    this.userService.getBranches().subscribe({
      next: (res) => {
        if (res.length > 0) {
          this.branchesList = res;
        }
      },
      error: (error) => {
        this.snackBar.dangerNotification(error);
      },
    });
  }

  onSubmit() {
    const payload = {
      "branchId": this.examForm?.controls['branch'].value,
      "examId": this.examForm?.controls['exam'].value,
      "startDate": this.examForm?.controls['startDate'].value,
      "endDate": this.examForm?.controls['endDate'].value,
      "description": this.examForm?.controls['description'].value,
    }

    this.pageLoader.showLoader();

    this.examService.addExamInfo(payload).subscribe({
      next: (res => {
        this.pageLoader.hideLoader();
      }),
      error: (error => {
        this.pageLoader.hideLoader();
        this.snackBar.dangerNotification(error);
      })
    });

  }
}
