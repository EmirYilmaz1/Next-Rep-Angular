import { Component, OnInit } from '@angular/core';
import { UserSevice } from '../../services/user';
import { User } from '../../models/user';
import { CdkNoDataRow } from "@angular/cdk/table";
import { Person } from '../../models/person';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { EditMemberDialog } from '../../dialogs/edit-member/edit-member';


@Component({
  selector: 'app-members',
  imports: [CommonModule, CdkNoDataRow],
  templateUrl: './members.html',
  styleUrl: './members.scss'
})
export class Members implements OnInit
{
  public members_:Person[] = [];
  constructor(private userService:UserSevice, private dialog: MatDialog)
  {

  }
  ngOnInit(): void {
    this.getMembers();
  }
  
getMembers(): void {
  this.userService.getUsers().subscribe({
    next: (p: any) => {
      console.log('RAW response:', p);
      console.log('isArray?', Array.isArray(p));
      console.log('keys:', p && typeof p === 'object' ? Object.keys(p).slice(0, 20) : null);

      // Eğer array ise:
      if (Array.isArray(p)) this.members_ = p;

      // Eğer { users: [...] } gibi bir şeyse:
      else if (p?.users && Array.isArray(p.users)) this.members_ = p.users;

      // Eğer { data: [...] } gibi bir şeyse:
      else if (p?.data && Array.isArray(p.data)) this.members_ = p.data;

      console.log('members_.length:', this.members_.length);
      console.log('first item:', this.members_[0]);
    },
    error: (err) => console.log('ERROR:', err),
  });
}
    openMembersDialog(user: Person) {
    const ref = this.dialog.open(EditMemberDialog, {
      width: '500px',
      data: { row: user }
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.loadMembers();
      }
    });
  }

    loadMembers() {
    this.userService.getUsers().subscribe({
      next: data => this.members_ = data,
      error: err => console.error(err)
    });
  }

}
