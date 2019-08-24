import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.scss']
})
export class ReminderComponent implements OnInit {

  public reminder: any = {};
  public isEdit: boolean;
  constructor(
    public dialogRef: MatDialogRef<ReminderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.reminder = this.data.reminder;
    this.reminder.background = this.reminder.background || '#03dff9';
    this.isEdit = this.data.isEdit;
  }

  onNoClick(): void {
    if(this.isEdit) {
      this.dialogRef.close({delete: this.isEdit});
    } else {
      this.dialogRef.close()
    }
  }
}
