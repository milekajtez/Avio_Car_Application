import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvioProfileComponent } from './avio-profile.component';

describe('AvioProfileComponent', () => {
  let component: AvioProfileComponent;
  let fixture: ComponentFixture<AvioProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvioProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvioProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
