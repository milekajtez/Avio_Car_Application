import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentACarRegistrationComponent } from './rent-a-car-registration.component';

describe('RentACarRegistrationComponent', () => {
  let component: RentACarRegistrationComponent;
  let fixture: ComponentFixture<RentACarRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentACarRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentACarRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
