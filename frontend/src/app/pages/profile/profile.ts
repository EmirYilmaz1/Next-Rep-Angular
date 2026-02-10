import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Person } from '../../models/person';
import { UserSevice } from '../../services/user';
UserSevice

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  person: Person | null = null;
  editMode = false;
  saving = false;
  errorMsg: string | null = null;

  form: Partial<Person> = {};

  constructor(private userService:UserSevice) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.userService.getProfile().subscribe({
      next: (p:any) => {
        this.person = p;
        this.editMode = false;
        this.form = { ...p };
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Failed to load profile';
      }
    });
  }

  startEdit(): void {
    if (!this.person) return;
    this.editMode = true;
    this.form = { ...this.person };
  }

  cancelEdit(): void {
    this.editMode = false;
    this.form = { ...this.person! };
  }

  save(): void {
    this.saving = true;
    this.userService.updateProfile(this.form).subscribe({
      next: (updated) => {
        this.person = updated;
        this.editMode = false;
        this.saving = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Failed to save profile';
        this.saving = false;
      }
    });

  }
}
