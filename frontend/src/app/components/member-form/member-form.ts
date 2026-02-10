import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { Person } from '../../models/person';

// İstersen bunu ayrı dosyaya da alabilirsin
type RoleOption = { id: number; name: string };

const ROLE_OPTIONS: RoleOption[] = [
  { id: 0, name: 'Admin' },
  { id: 1, name: 'Management' },
  { id: 2, name: 'Regular' },
  { id: 3, name: 'Premium' },
];

@Component({
  selector: 'member-form',
  templateUrl: './member-form.html',
  styleUrls: ['./member-form.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatSelectModule, MatOptionModule],
})
export class MemberFormComponent {
  @Input() row!: Person | null;
  @Output() validChange = new EventEmitter<boolean>();

  form: FormGroup;
  roleOptions = ROLE_OPTIONS;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      ROLE_role_id: [null, Validators.required],
    });

    this.form.statusChanges.subscribe(() => {
      this.validChange.emit(this.form.valid);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['row'] && this.row) {
      this.form.patchValue({
        ROLE_role_id: this.row.ROLE_role_id,
      });

      this.validChange.emit(this.form.valid);
    }
  }

  ngAfterViewInit() {
    this.form.markAllAsTouched();
  }

  getRolePayload(): { ROLE_role_id: number } {
    return { ROLE_role_id: this.form.value.ROLE_role_id };
  }
}