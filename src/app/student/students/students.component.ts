import {Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@core';
import { SnackbarService } from '@shared/snackbar.service';
import { BranchService } from 'app/branch/branch.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';
import { StudentsService } from '../students.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {AssignSectionComponent} from "../../academic/class/assign-section/assign-section.component";


@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent {

    constructor(
        private fb: UntypedFormBuilder,
        private branchService: BranchService,
        private snackBar: SnackbarService,
        private pageLoader: PageLoaderService,
        private dialog: MatDialog,
        private studentService:StudentsService

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
    levelList: any;
    classList: any;
    classForm?: FormGroup;
    selectedStatus: '0' | '1' = '1';
    displayedColumns: string[] = ['studentid', 'firstname', 'lastname', 'pob','academicYear'];
    dataSource!: MatTableDataSource<any>;
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    ngOnInit(): void {
        let formFields = {
            branchId: ['', [Validators.required]],
            levelId:  ['', [Validators.required]],
            classId:  ['', Validators.required],
            isActive: ['1'],
        };
        this.classForm = this.fb.group(formFields)

        this.loadBranches()

    }

    onBranchChange(branchId: any) {
        this.studentService.findLevelByBranchId(branchId).subscribe({
            next:(res) => {
                this.levelList = res;
            },
            error:(error) => {
                this.snackBar.dangerNotification(error);
            }
        })
    }

    onLevelChange() {
        const payload = {
            branchId: this.classForm?.controls['branchId'].value,
            levelId: this.classForm?.controls['levelId'].value,
            isActive: this.classForm?.controls['isActive'].value
        }
        this.studentService.findClassByLevelId(payload).subscribe({
            next:(res) => {
                this.classList = res;
            },
            error:(error) => {
                this.snackBar.dangerNotification(error);
            }
        })
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

    onSubmit() {
        const payload = this.classForm?.value;
        this.pageLoader.showLoader()
      console.log(payload)
        this.studentService.findClassByBranchAndLevel(payload).subscribe({
            next:(res) => {
                console.log(res);
                this.dataSource = new MatTableDataSource(res);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
                this.pageLoader.hideLoader()
            },
            error:(error) => {
                this.pageLoader.hideLoader()
                this.snackBar.dangerNotification(error);
            }
        })
    }

    assignClassSection(row:any) {
        console.log(row);

        this.dialog.open(AssignSectionComponent)
    }
}
