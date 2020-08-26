import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAirlinesComponent } from './view-airlines.component';

describe('ViewAirlinesComponent', () => {
  let component: ViewAirlinesComponent;
  let fixture: ComponentFixture<ViewAirlinesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAirlinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAirlinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
