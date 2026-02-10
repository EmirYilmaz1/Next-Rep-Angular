import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { EquipmentListComponent } from "../../components/equipment-list-component/equipment-list-component";
import { EquipmentDialog } from '../../dialogs/equipment-dialog/equipment-dialog';
import { MuscleDistributionComponent } from '../../components/muscle-distribution/muscle-distribution';

@Component({
  selector: 'app-equipments-page',
  standalone: true,
  imports: [EquipmentListComponent, MatDialogModule, MatButtonModule, MuscleDistributionComponent],
  templateUrl: './equipments-page.html',
  styleUrl: './equipments-page.scss'
})
export class EquipmentsPage {
  constructor(private dialog: MatDialog) {}

  openAddDialog() {
    this.dialog.open(EquipmentDialog, { width: '520px' })
      .afterClosed()
      .subscribe((changed) => {
        if (changed) {
          // en basit: sayfayı yeniden render etsin
          window.location.reload();
        }
      });
  }
}
