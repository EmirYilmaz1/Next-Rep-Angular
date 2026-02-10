import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth';
import { User } from '../../models/user';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  imports: [MatDialogModule, MatInputModule, ReactiveFormsModule ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterDialog 
{
  form: FormGroup;
  formValid: boolean = false;
loading = false;

        constructor(
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<RegisterDialog>,
        private authService: AuthService,
        private fb: FormBuilder
    ) {
      this.form = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required,  Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        name: ['', [Validators.required, Validators.minLength(1)]],
        surname: ['', [Validators.required , Validators.minLength(1)]]


      } , { validators: passwordsMatch});
    }


   onRegister() {
    if (this.form.invalid) return;

    this.loading = true;
    const { username, password, name, surname } = this.form.value;

    this.authService.register(username, password, name,surname).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Account created!', 'OK', { duration: 2500 });
        this.dialogRef.close(true);
      },
      error: (err:any) => {
        this.loading = false;
        this.snackBar.open(err?.error?.message ?? 'Register failed', 'OK', { duration: 3000 });
      }
    });
  }
}
