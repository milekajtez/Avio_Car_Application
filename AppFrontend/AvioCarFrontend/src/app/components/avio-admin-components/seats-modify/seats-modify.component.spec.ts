import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatsModifyComponent } from './seats-modify.component';

describe('SeatsModifyComponent', () => {
  let component: SeatsModifyComponent;
  let fixture: ComponentFixture<SeatsModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeatsModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatsModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
