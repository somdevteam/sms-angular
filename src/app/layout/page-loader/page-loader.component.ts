import { Component, OnInit } from '@angular/core';
import { PageLoaderService } from './page-loader.service';
@Component({
  selector: 'app-page-loader',
  templateUrl: 'page-loader.component.html',
})
export class PageLoaderComponent implements OnInit {
  public showLoader: boolean = false;
  constructor(private pageLoaderService: PageLoaderService) {
    //constructor
  }
  ngOnInit() {
    this.pageLoaderService.show.subscribe(showLoader => {
      this.showLoader = showLoader
    });
  }
}
