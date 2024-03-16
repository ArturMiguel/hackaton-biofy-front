import Swal from "sweetalert2";
import { SweetAlertIcon } from "sweetalert2";

export default class SweetAlert {
  static success(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      icon: "success",
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      timer: 3500,
      timerProgressBar: true,
      showCloseButton: true
    })
  }

  static error(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      icon: "error",
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      timer: 4500,
      timerProgressBar: true,
      showCloseButton: true
    })
  }

  static info(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      icon: "info",
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      timer: 3500,
      timerProgressBar: true,
      showCloseButton: true
    })
  }

  static warning(title: string, text: string, timer = 3500): void {
    Swal.fire({
      title,
      text,
      icon: "warning",
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      timer,
      timerProgressBar: true,
      showCloseButton: true
    })
  }
}