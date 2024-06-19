import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '@shared/snackbar.service';
import { BranchService } from 'app/branch/branch.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';
import { StudentsService } from '../students.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EditStudentComponent } from "../edit-student/edit-student.component";
import { setupConditionalValidation } from '@shared/common/utils';


@Component({
    selector: 'app-students',
    templateUrl: './students.component.html',
    styleUrls: ['./students.component.scss']
})
export class StudentsComponent {

    isLoadingClass: boolean = false;

    constructor(
        private fb: UntypedFormBuilder,
        private branchService: BranchService,
        private snackBar: SnackbarService,
        private pageLoader: PageLoaderService,
        private dialog: MatDialog,
        private studentService: StudentsService

    ) {}

    breadscrums = [
        {
            title: 'Class',
            items: ['List Class'],
            active: 'Class',
        },
    ];
    branchesList: any;
    classList: any;
    sectionList: any = []
    classForm?: FormGroup;
    selectedStatus: '0' | '1' = '1';
    displayedColumns: string[] = ['studentId', 'rollNumber', 'firstName', 'middleName', 'lastName','className','sectionName', 'responsibleName', 'responsiblePhone', 'pob', 'academicYear', 'actions'];
    dataSource!: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    ngOnInit(): void {
        let formFields = {
            branchId: [, [Validators.required]],
            classId: [, Validators.required],
            rollNumber: [],
            sectionId: []
        };
        this.classForm = this.fb.group(formFields)
        setupConditionalValidation(this.classForm, 'rollNumber', ['classId']);
        this.loadBranches()

    }

    onBranchChange() {
        this.isLoadingClass = true;
        const payload = {
            branchId: this.classForm?.controls['branchId'].value,
        }
        this.classForm?.controls['classId'].setValue('');
        this.studentService.findClassByBranchId(payload).subscribe({
            next: (res) => {
                this.isLoadingClass = false;
                this.classList = res;
            },
            error: (error) => {
                this.isLoadingClass = false;
                this.snackBar.dangerNotification(error);
            }
        })
    }

    onClassChange() {
        const payload = {
            classId: this.classForm?.controls['classId'].value,
            branchId: this.classForm?.controls['branchId'].value,
        }
        this.studentService.findSectionsByFilter(payload).subscribe({
            next: (res) => {
                this.sectionList = res;
            },
            error: (error) => {
                this.snackBar.dangerNotification(error);
            }
        })
    }


    loadBranches() {
        this.branchService.getBranches().subscribe({
            next: (res) => {
                this.branchesList = res;
                // if (res.length == 1) {
                //     this.classForm?.controls['branchId'].setValue ( res[0].branchId)
                // }
            },
            error: (error) => {
                this.snackBar.dangerNotification(error);
            }
        })
    }

    onSubmit() {
        const payload = this.classForm?.value;
        console.log(payload);
        
        this.pageLoader.showLoader()
        this.studentService.findClassByBranchAndLevel(payload).subscribe({
            next: (res) => {
                console.log(res);
                this.dataSource = new MatTableDataSource(res);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
                this.pageLoader.hideLoader()
            },
            error: (error) => {
                this.pageLoader.hideLoader()
                this.snackBar.dangerNotification(error);
            }
        })
    }

    editUsers(user: any) {
        console.log(user);
        const dialogRef = this.dialog.open(EditStudentComponent, {
            data: user,
            // position: {top: '10%'},
            width: '70%',
        }).afterClosed().subscribe((result) => {
            if (result == 'edited') {
                // this.loadUsersBranch()
            }
        });
    }

}
