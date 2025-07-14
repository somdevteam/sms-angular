import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStudentAttendanceComponent } from './add-student-attendance.component';

describe('AddStudentAttendanceComponent', () => {
  let component: AddStudentAttendanceComponent;
  let fixture: ComponentFixture<AddStudentAttendanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddStudentAttendanceComponent]
    });
    fixture = TestBed.createComponent(AddStudentAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
