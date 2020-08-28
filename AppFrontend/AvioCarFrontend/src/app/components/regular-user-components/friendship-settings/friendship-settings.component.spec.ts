import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendshipSettingsComponent } from './friendship-settings.component';

describe('FriendshipSettingsComponent', () => {
  let component: FriendshipSettingsComponent;
  let fixture: ComponentFixture<FriendshipSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendshipSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendshipSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
