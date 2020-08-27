import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentACarServicesComponent } from './rent-a-car-services.component';

describe('RentACarServicesComponent', () => {
  let component: RentACarServicesComponent;
  let fixture: ComponentFixture<RentACarServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentACarServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentACarServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
