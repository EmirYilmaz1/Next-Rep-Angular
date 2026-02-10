import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { WorkoutE, WorkoutExercise } from '../../models/workouts_exercises';
import { CreateWorkOutHistoryPayload } from '../../models/workoutHistory'; 
@Component({
  selector: 'app-workout-data-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './workout-data-form.html',
  styleUrl: './workout-data-form.scss'
})
export class WorkoutDataForm implements OnChanges {
  @Input() workout_e!: WorkoutE;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      durationMinutes: ['', Validators.required],
      notes: ['', Validators.required],
      date: ['', Validators.required],

      exercises: this.fb.array([])
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['workout_e'] && this.workout_e?.exercises?.length) {
      this.initExercisesFromWorkout();
    }
  }

  get exercisesFA(): FormArray {
    return this.form.get('exercises') as FormArray;
  }

  logsFA(exerciseIndex: number): FormArray {
    return this.exercisesFA.at(exerciseIndex).get('logs') as FormArray;
  }

  private createSetGroup(): FormGroup {
    return this.fb.group({
      weight: [''],
      reps: [''],
    });
  }

  private createExerciseGroup(ex: WorkoutExercise): FormGroup {
    const setsCount = ex.plannedSets ?? 3;

    return this.fb.group({
      exercise_id: [ex.exercise_id, Validators.required],
      name: [ex.name], 

      logs: this.fb.array(
        Array.from({ length: setsCount }, () => this.createSetGroup())
      )
    });
  }

  private initExercisesFromWorkout(): void {
    this.exercisesFA.clear();

    for (const ex of this.workout_e.exercises) {
      this.exercisesFA.push(this.createExerciseGroup(ex));
    }
  }

getPayload(): CreateWorkOutHistoryPayload {
  const v = this.form.value;

  const flatLogs = (v.exercises ?? []).flatMap((ex: any) =>
    (ex.logs ?? []).map((set: any, i: number) => ({
      exercise_id: ex.exercise_id,
      set_number: i + 1,
      weight: Number(set.weight),
      reps: Number(set.reps),
    }))
  );

  return {
    WORKOUT_workout_id: this.workout_e.workout_id,
    durationMinutes: Number(v.durationMinutes),
    notes: v.notes,
    date: v.date,
    logs: flatLogs,
  };
}
  trackByIndex = (_: number, __: any) => _;
}
