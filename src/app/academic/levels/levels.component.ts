import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core';
import { SnackbarService } from '@shared/snackbar.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';
import { AcademicService } from '../academic.service';
import { MatDialog } from '@angular/material/dialog';
import { AssingClassComponent } from './assing-class/assing-class.component';
import { ViewClassComponent } from './view-class/view-class.component';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-levels',
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.scss']
})
export class LevelsComponent implements OnInit {
  breadscrums = [
    {
      title: 'Levels',
      items: ['List Levels'],
      active: 'Level',
    },
  ];

  levelsData: any[] = [];
  constructor(
    private academicService: AcademicService,
    private snackBar: SnackbarService,
    private pageLoader: PageLoaderService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    // Remove auto-loading of data
  }

  assingClass(row: any) {
    const dialogRef = this.dialog.open(AssingClassComponent, {
      width: '50%',
      data: row,
    });
  }

  viewClass(row: any) {
    const dialogRef = this.dialog.open(ViewClassComponent, {
      width: '80%',
      data: row,
    });
  }

  loadLevels() {
    this.pageLoader.showLoader()
    this.academicService.findAllLevels().subscribe({
      next: (res) => {
        this.pageLoader.hideLoader()
        this.levelsData = res;
        console.log(res);
      },
      error: (error) => {
        this.pageLoader.hideLoader()
        this.snackBar.errorDialog('',error);
      },
    });
  }

  getStatusSeverity(status: boolean): string {
    return status ? 'success' : 'danger';
  }

  onSearch() {
    this.loadLevels();
  }
}
