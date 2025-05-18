import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../components/confirm/confirm.component';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  confirmDialog(): Observable<boolean>{
    const dialogRef = this.dialog.open(ConfirmComponent);

    return dialogRef.afterClosed();
  }
}
