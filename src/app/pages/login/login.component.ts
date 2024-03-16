import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as feather from 'feather-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true ;
  constructor(private router: Router) { }

  ngOnInit(): void {
    feather.replace();
  }

  togglePassword(): void {
    this.hide = !this.hide;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const eyeIcon = document.getElementById('eye-icon');

    if (this.hide) {
        passwordInput.type = 'password';
    } else {
        passwordInput.type = 'text';
    }

    if (eyeIcon) {
      if(eyeIcon){
        if (this.hide) {
          eyeIcon.setAttribute('data-feather', 'eye');
        } else {
          eyeIcon.setAttribute('data-feather', 'eye-off');
        }
        feather.replace(); // Atualiza o ícone do Feather Icons
      }
    }
  }

  login(): void{
    this.router.navigate(['/camera'])
  }

}
