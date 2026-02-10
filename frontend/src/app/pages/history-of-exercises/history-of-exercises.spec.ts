import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryOfExercises } from './history-of-exercises';

describe('HistoryOfExercises', () => {
  let component: HistoryOfExercises;
  let fixture: ComponentFixture<HistoryOfExercises>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryOfExercises]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryOfExercises);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
