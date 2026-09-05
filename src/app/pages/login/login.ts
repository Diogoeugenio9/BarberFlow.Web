import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  senha: string = '';
  carregando = false;
  erro = '';

  constructor(
    private http: HttpClient,
    private authService: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  login() {
    this.carregando = true;
    this.erro = '';
    this.cdr.detectChanges();

    const dados = {
      email: this.email,
      password: this.senha
    };

    this.http.post(
      'https://localhost:7134/api/Auth/login',
      dados
    ).subscribe({
      next: (response: any) => {
        this.carregando = false;
        this.authService.saveToken(response.token);
        this.cdr.detectChanges();
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.carregando = false;
        this.erro = 'E-mail ou senha incorretos.';
        this.cdr.detectChanges();
        console.log('Erro:', error);
      }
    });
  }
}
