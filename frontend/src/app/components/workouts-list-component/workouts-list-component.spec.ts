import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutsListComponent } from './workouts-list-component';

describe('WorkoutsListComponent', () => {
  let component: WorkoutsListComponent;
  let fixture: ComponentFixture<WorkoutsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
