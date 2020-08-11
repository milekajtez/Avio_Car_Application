import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirlineRegistrationComponent } from './airline-registration.component';

describe('AirlineRegistrationComponent', () => {
  let component: AirlineRegistrationComponent;
  let fixture: ComponentFixture<AirlineRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirlineRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirlineRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
