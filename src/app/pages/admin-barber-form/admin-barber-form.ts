import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-admin-barber-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-barber-form.html',
  styleUrl: './admin-barber-form.css',
})
export class AdminBarberForm {
  private http = inject(HttpClient);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  nome = '';
  email = '';
  telefone = '';
  especialidade = '';

  carregando = false;
  erro = '';

  cadastrar(): void {
    this.erro = '';

    if (!this.nome.trim()) {
      this.erro = 'Informe o nome do barbeiro.';
      return;
    }

    if (!this.email.trim()) {
      this.erro = 'Informe o e-mail do barbeiro.';
      return;
    }

    if (!this.telefone.trim()) {
      this.erro = 'Informe o telefone do barbeiro.';
      return;
    }

    this.carregando = true;
    this.cdr.detectChanges();

    const token = localStorage.getItem('token');

    const dados = {
      name: this.nome,
      email: this.email,
      phone: this.telefone,
      specialty: this.especialidade
    };

    this.http.post(
      'https://localhost:7134/api/Barbers',
      dados,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigate(['/admin/barbers']);
      },
      error: (error) => {
        this.carregando = false;
        this.erro = 'Não foi possível cadastrar o barbeiro.';
        this.cdr.detectChanges();
        console.error('Erro ao cadastrar barbeiro:', error);
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/admin/barbers']);
  }
}
