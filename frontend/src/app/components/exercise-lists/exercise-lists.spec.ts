import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseLists } from './exercise-lists';

describe('ExerciseLists', () => {
  let component: ExerciseLists;
  let fixture: ComponentFixture<ExerciseLists>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseLists]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseLists);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
