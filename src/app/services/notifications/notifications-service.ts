import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) {}

  showSuccess(message: string) {
    this.toastr.success(message, 'Succès', {
      timeOut: 5000,
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true
    }); 
  }

  showError(message: string) {
    this.toastr.error(message, 'Erreur', {
      timeOut: 5000,
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true
    });
  }

  showWarning(message: string) {
    this.toastr.warning(message, 'Attention', {
      timeOut: 5000,
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true
    });
  }
}
