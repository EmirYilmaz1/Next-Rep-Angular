import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Equipment } from '../../models/equipment';;
import { CommonModule } from '@angular/common';
import { EquipmentService } from '../../services/equipment';
import { MatDialog } from '@angular/material/dialog';

import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-equipment-list',
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './equipment-list-component.html',
  styleUrl: './equipment-list-component.scss',

})
export class EquipmentListComponent implements OnInit {

  equipments: Equipment[] = [];
  

  constructor(private equipmentService: EquipmentService , private dialog: MatDialog,  private snackBar: MatSnackBar ) {}

  ngOnInit(): void {
    this.equipmentService.getEquipments()
      .subscribe({
        next: (data) => this.equipments = data,
        error: (err) => {
  console.log('UPDATE ERROR FULL =>', err);
  this.snackBar.open(
    err?.error?.message ?? err?.message ?? JSON.stringify(err?.error) ?? 'Unknown error',
    'Close',
    { duration: 8000 }
  );
}
      });
  }


  deleteEquipment(id: number) {
    this.equipmentService.deleteEquipment(id).subscribe({
      next: () => this.loadEquipments(), 
      error: err => console.log(err)
    });
  }

  loadEquipments() {
  this.equipmentService.getEquipments().subscribe({
    next: data => this.equipments = data,
    error: err => console.log(err)
  });
}
}