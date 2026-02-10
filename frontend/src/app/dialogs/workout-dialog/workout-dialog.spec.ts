import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutDialog } from './workout-dialog';

describe('WorkoutDialog', () => {
  let component: WorkoutDialog;
  let fixture: ComponentFixture<WorkoutDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
