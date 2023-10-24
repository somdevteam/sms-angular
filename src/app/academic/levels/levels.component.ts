import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '@core';
import { SnackbarService } from '@shared/snackbar.service';
import { PageLoaderService } from 'app/layout/page-loader/page-loader.service';
import { AcademicService } from '../academic.service';
import { MatDialog } from '@angular/material/dialog';
import { AssingClassComponent } from './assing-class/assing-class.component';

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

  levelsData!: MatTableDataSource<any>;
  displayedColumns: string[] = ['levelid', 'levelname', 'datecreated', 'isactive','actions'];

  constructor(
    private academicService:AcademicService,
    private snackBar: SnackbarService,
    private pageLoader: PageLoaderService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadLevels()
  }

  assingClass(row:any) {
    const dialogRef = this.dialog.open(AssingClassComponent, {
      width: '50%',
      data: row,
    });
  }

  loadLevels() {
    this.pageLoader.showLoader()
    this.academicService.findAllLevels().subscribe({
      next: (res) => {
        this.pageLoader.hideLoader()
        this.levelsData = new MatTableDataSource(res);
        // this.academicData.sort = this.sort;
        // this.academicData.paginator = this.paginator;
        console.log(res);
        
      },
      error: (error) => {
        this.pageLoader.hideLoader()
        this.snackBar.errorDialog('',error);
      },
    });
  }
  
}
