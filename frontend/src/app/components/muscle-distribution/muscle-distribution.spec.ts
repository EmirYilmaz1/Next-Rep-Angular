import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuscleDistribution } from './muscle-distribution';

describe('MuscleDistribution', () => {
  let component: MuscleDistribution;
  let fixture: ComponentFixture<MuscleDistribution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuscleDistribution]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MuscleDistribution);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
