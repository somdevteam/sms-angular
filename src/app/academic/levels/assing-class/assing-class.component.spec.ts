import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssingClassComponent } from './assing-class.component';

describe('AssingClassComponent', () => {
  let component: AssingClassComponent;
  let fixture: ComponentFixture<AssingClassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssingClassComponent]
    });
    fixture = TestBed.createComponent(AssingClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
