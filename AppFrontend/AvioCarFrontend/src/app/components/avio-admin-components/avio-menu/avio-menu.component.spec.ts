import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvioMenuComponent } from './avio-menu.component';

describe('AvioMenuComponent', () => {
  let component: AvioMenuComponent;
  let fixture: ComponentFixture<AvioMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvioMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvioMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
