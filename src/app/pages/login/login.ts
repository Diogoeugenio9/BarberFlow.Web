import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  senha: string = '';

  constructor(
  private http: HttpClient,
  private authService: Auth,
  private router: Router
) {}

  login() {
    const dados = {
      email: this.email,
      password: this.senha
    };

    this.http.post(
      'https://localhost:7134/api/Auth/login',
      dados
    ).subscribe({
      next: (response: any) => {

        this.authService.saveToken(response.token);

        console.log('Token salvo com sucesso!');
        console.log(response.token);

        this.router.navigate(['/home']);

},
      error: (error) => {
        console.log('Erro:', error);
      }
    });
  }
}
