import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { Exercise } from '../../models/exercise';
import { HistoryService } from '../../services/history';

@Component({
  selector: 'exercise-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './exercise-form.html',
  styleUrl: './exercise-form.scss'
})
export class ExerciseFormComponent {

  @Output() validChange = new EventEmitter<boolean>();

  form: FormGroup;

  constructor(private fb: FormBuilder, historyService:HistoryService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      muscle_group_name: ['', Validators.required],
      equipment_name: [''],
      EQUIPMENT_equipment_id: [null, Validators.required],
      MUSCLE_GROUP_id: [null, Validators.required]
    });


  }


  getPayload(): Omit<Exercise, 'exercise_id'> {
    return this.form.value;
  }
}
