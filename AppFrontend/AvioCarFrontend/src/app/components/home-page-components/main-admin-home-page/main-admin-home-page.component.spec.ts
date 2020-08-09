import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainAdminHomePageComponent } from './main-admin-home-page.component';

describe('MainAdminHomePageComponent', () => {
  let component: MainAdminHomePageComponent;
  let fixture: ComponentFixture<MainAdminHomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainAdminHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainAdminHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
