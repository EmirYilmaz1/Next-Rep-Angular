import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutDataForm } from './workout-data-form';

describe('WorkoutDataForm', () => {
  let component: WorkoutDataForm;
  let fixture: ComponentFixture<WorkoutDataForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutDataForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutDataForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
