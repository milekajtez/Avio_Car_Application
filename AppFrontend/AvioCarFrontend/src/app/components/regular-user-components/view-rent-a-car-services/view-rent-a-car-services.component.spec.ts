import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRentACarServicesComponent } from './view-rent-a-car-services.component';

describe('ViewRentACarServicesComponent', () => {
  let component: ViewRentACarServicesComponent;
  let fixture: ComponentFixture<ViewRentACarServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRentACarServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRentACarServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
