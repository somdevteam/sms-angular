import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageLoaderService {

  constructor() { }
  private loaderSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public show = this.loaderSubject.asObservable();

  public showLoader() {
    this.loaderSubject.next(true);
  }

  public hideLoader() {
    this.loaderSubject.next(false);
  }
}
