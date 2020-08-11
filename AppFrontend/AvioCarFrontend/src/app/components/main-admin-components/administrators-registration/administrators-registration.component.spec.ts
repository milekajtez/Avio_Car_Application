import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorsRegistrationComponent } from './administrators-registration.component';

describe('AdministratorsRegistrationComponent', () => {
  let component: AdministratorsRegistrationComponent;
  let fixture: ComponentFixture<AdministratorsRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministratorsRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministratorsRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
