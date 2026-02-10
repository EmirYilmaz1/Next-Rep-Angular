import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Person } from '../../models/person';
import { UserSevice } from '../../services/user';
import { MemberFormComponent } from '../../components/member-form/member-form';

@Component({
  selector: 'app-edit-member',
  standalone: true,
  imports: [MatDialogModule, MemberFormComponent,],
  templateUrl: './edit-member.html',
  styleUrl: './edit-member.scss'
})
export class EditMemberDialog {

  @ViewChild(MemberFormComponent)
  memberForm!: MemberFormComponent;

  constructor(
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditMemberDialog>,
    private userService: UserSevice,

    @Inject(MAT_DIALOG_DATA)
    public data: { row: Person }
  ) {}

  onModify(): void {
    if (!this.memberForm.form.valid) {
      return;
    }

    const payload = this.memberForm.getRolePayload(); // { ROLE_role_id: X }
    const userId = this.data.row.user_id;

    this.userService.updateUserRole(userId, payload).subscribe({
      next: () => {
        this.snackBar.open('Role updatd successfuly', 'Close', {
          duration: 4000,
          panelClass: ['snackbar-success']
});

        this.dialogRef.close({ user_id: userId, ...payload });
      },
      error: (err:any) => {
        this.snackBar.open(err?.error?.message ?? 'Update failed', 'Close', {
          duration: 4000,
          panelClass: ['snackbar-error']
        });

        this.dialogRef.close();
      }
    });
  }
}
