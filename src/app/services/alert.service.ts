import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}
  warningMessage(message: String) {
    Swal.fire({
      title: 'Warning!',
      text: `${message}`,
      icon: 'warning',
      confirmButtonText: 'OK',
      
    });
  }
  successMessage(message: String) {
    Swal.fire({
      title: 'Success!',
      text: `${message}`,
      icon: 'success',
      confirmButtonText: 'OK',
    });
  }
  errorMessage(message: String) {
    Swal.fire({
      title: 'Error!',
      text: `${message}`,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }
  
  loadingMessage(message:String){
    Swal.fire({
      title: '',
      text: `${message}`,
      icon: 'warning',
      confirmButtonText: 'OK',
      allowOutsideClick:false,
      didOpen: () => {
        Swal.showLoading()
      },
    });
  }
  confirmMessage(title: string,message:string){
    Swal.fire({
      title: `${title}`,
      text: `${message}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xoá'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Đã xoá!',
          'Xoá thành công.',
          'success'
        )
      }
    })
  }
}
