import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseHistory } from './exercise-history';

describe('ExerciseHistory', () => {
  let component: ExerciseHistory;
  let fixture: ComponentFixture<ExerciseHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
