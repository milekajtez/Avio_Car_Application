import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarMenuComponent } from './car-menu.component';

describe('CarMenuComponent', () => {
  let component: CarMenuComponent;
  let fixture: ComponentFixture<CarMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
