import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginHistoriesComponent } from './login-histories.component';

describe('LoginHistoriesComponent', () => {
  let component: LoginHistoriesComponent;
  let fixture: ComponentFixture<LoginHistoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginHistoriesComponent]
    });
    fixture = TestBed.createComponent(LoginHistoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
