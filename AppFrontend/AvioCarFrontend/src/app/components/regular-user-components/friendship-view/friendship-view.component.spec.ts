import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendshipViewComponent } from './friendship-view.component';

describe('FriendshipViewComponent', () => {
  let component: FriendshipViewComponent;
  let fixture: ComponentFixture<FriendshipViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendshipViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendshipViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
