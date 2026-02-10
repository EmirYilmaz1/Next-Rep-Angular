import { Component, ViewChild } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { EquipmentFormComponent } from '../../components/equipment-form/equipment-form';
import { EquipmentService } from '../../services/equipment';

@Component({
  selector: 'equipment-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, EquipmentFormComponent],
  templateUrl: './equipment-dialog.html',
})
export class EquipmentDialog {
  @ViewChild(EquipmentFormComponent) equipmentForm!: EquipmentFormComponent;
  formValid = false;

  constructor(
    private dialogRef: MatDialogRef<EquipmentDialog>,
    private equipmentService: EquipmentService
  ) {}

  onFormValidChange(v: boolean) {
    this.formValid = v;
  }

  onAdd() {
    if (!this.equipmentForm.form.valid) return;

    this.equipmentService.addEquipment(this.equipmentForm.form.value).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        console.log('ADD ERROR =>', err);
        this.dialogRef.close(false);
      }
    });
  }
}
