import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicDialogComponent } from './academic-dialog.component';

describe('AcademicDialogComponent', () => {
  let component: AcademicDialogComponent;
  let fixture: ComponentFixture<AcademicDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcademicDialogComponent]
    });
    fixture = TestBed.createComponent(AcademicDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
