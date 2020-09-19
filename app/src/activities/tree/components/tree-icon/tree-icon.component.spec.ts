import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeIconComponent } from './tree-icon.component';

describe('TreeIconComponent', () => {
  let component: TreeIconComponent;
  let fixture: ComponentFixture<TreeIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
