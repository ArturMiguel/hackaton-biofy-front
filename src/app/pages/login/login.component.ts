import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true ;
  constructor() { }

  ngOnInit(): void {
  }

  togglePassword(): void {
    this.hide = !this.hide;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.type = this.hide ? 'password' : 'text'; // Alterna entre 'password' e 'text' para ocultar ou exibir a senha
  }

}
