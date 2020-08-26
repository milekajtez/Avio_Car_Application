import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegularProfileComponent } from './regular-profile.component';

describe('RegularProfileComponent', () => {
  let component: RegularProfileComponent;
  let fixture: ComponentFixture<RegularProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegularProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegularProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
