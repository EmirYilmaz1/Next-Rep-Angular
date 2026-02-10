import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutDataDialog } from './workout-data-dialog';

describe('WorkoutDataDialog', () => {
  let component: WorkoutDataDialog;
  let fixture: ComponentFixture<WorkoutDataDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutDataDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutDataDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
