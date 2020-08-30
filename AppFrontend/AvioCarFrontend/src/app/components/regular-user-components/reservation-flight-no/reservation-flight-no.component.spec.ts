import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationFlightNoComponent } from './reservation-flight-no.component';

describe('ReservationFlightNoComponent', () => {
  let component: ReservationFlightNoComponent;
  let fixture: ComponentFixture<ReservationFlightNoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationFlightNoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationFlightNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
