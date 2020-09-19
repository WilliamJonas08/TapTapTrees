import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupTypeComponent } from './setup-type.component';

describe('SetupTypeComponent', () => {
  let component: SetupTypeComponent;
  let fixture: ComponentFixture<SetupTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
