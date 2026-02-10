import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseDialog } from './exercise-dialog';

describe('ExerciseDialog', () => {
  let component: ExerciseDialog;
  let fixture: ComponentFixture<ExerciseDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
