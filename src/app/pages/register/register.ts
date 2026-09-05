import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private router = inject(Router);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  nome = '';
  email = '';
  senha = '';
  confirmarSenha = '';

  carregando = false;

  erro = '';
  tipoMensagem = '';

  erroNome = '';
  erroEmail = '';
  erroSenha = '';
  erroConfirmarSenha = '';

  mostrarMensagem(mensagem: string, tipo: string): void {
    this.erro = mensagem;
    this.tipoMensagem = tipo;

    this.cdr.detectChanges();

    setTimeout(() => {
      this.erro = '';
      this.tipoMensagem = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  cadastrar(): void {
    this.erro = '';
    this.erroNome = '';
    this.erroEmail = '';
    this.erroSenha = '';
    this.erroConfirmarSenha = '';

    if (!this.nome.trim()) {
      this.erroNome = 'Informe seu nome.';
    }

    if (!this.email.trim()) {
      this.erroEmail = 'Informe seu e-mail.';
    } else if (!this.email.includes('@')) {
      this.erroEmail = 'Informe um e-mail válido.';
    }

    if (!this.senha.trim()) {
      this.erroSenha = 'Informe sua senha.';
    }

    if (!this.confirmarSenha.trim()) {
      this.erroConfirmarSenha = 'Confirme sua senha.';
    } else if (this.senha !== this.confirmarSenha) {
      this.erroConfirmarSenha = 'As senhas não coincidem.';
    }

    if (
      this.erroNome ||
      this.erroEmail ||
      this.erroSenha ||
      this.erroConfirmarSenha
    ) {
      this.cdr.detectChanges();
      return;
    }

    this.carregando = true;
    this.cdr.detectChanges();

    const dados = {
      name: this.nome,
      email: this.email,
      password: this.senha
    };

    this.http.post(
      'https://localhost:7134/api/Auth/register',
      dados
    ).subscribe({
      next: () => {
        this.carregando = false;

        this.mostrarMensagem(
          'Cadastro realizado com sucesso!',
          'sucesso'
        );

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.carregando = false;

        console.error('Erro ao cadastrar:', error);

        this.mostrarMensagem(
          'Não foi possível realizar o cadastro.',
          'erro'
        );
      }
    });
  }

  irParaLogin(): void {
    this.router.navigate(['/login']);
  }
}
