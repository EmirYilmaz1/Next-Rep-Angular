import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'equipment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './equipment-form.html',
})
export class EquipmentFormComponent {
  @Output() validChange = new EventEmitter<boolean>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      alternatives: ['']
    });

    this.form.statusChanges.subscribe(() => this.validChange.emit(this.form.valid));
  }
}
