import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendshipConfigurationComponent } from './friendship-configuration.component';

describe('FriendshipConfigurationComponent', () => {
  let component: FriendshipConfigurationComponent;
  let fixture: ComponentFixture<FriendshipConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendshipConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendshipConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
