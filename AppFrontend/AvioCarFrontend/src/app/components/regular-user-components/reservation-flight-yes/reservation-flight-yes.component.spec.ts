import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationFlightYesComponent } from './reservation-flight-yes.component';

describe('ReservationFlightYesComponent', () => {
  let component: ReservationFlightYesComponent;
  let fixture: ComponentFixture<ReservationFlightYesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationFlightYesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationFlightYesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
