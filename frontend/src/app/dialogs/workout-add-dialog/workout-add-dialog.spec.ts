import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutAddDialog } from './workout-add-dialog';

describe('WorkoutAddDialog', () => {
  let component: WorkoutAddDialog;
  let fixture: ComponentFixture<WorkoutAddDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutAddDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutAddDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
