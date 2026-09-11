import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-client-form.html',
  styleUrl: './admin-client-form.css',
})
export class AdminClientForm implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  id = '';

  nome = '';
  email = '';
  telefone = '';

  carregando = false;
  carregandoDados = false;
  erro = '';

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';

    if (this.id) {
      this.carregarCliente();
    }
  }

  carregarCliente(): void {
    this.carregandoDados = true;

    const token = localStorage.getItem('token');

    this.http.get<any>(
      `https://localhost:7134/api/Users/clients/${this.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: (response) => {
        this.nome = response.name;
        this.email = response.email;
        this.telefone = response.phone;

        this.carregandoDados = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.carregandoDados = false;
        this.erro = 'Não foi possível carregar o cliente.';
        this.cdr.detectChanges();
        console.error('Erro ao carregar cliente:', error);
      }
    });
  }

  salvar(): void {
    this.erro = '';

    if (!this.nome.trim()) {
      this.erro = 'Informe o nome do cliente.';
      return;
    }

    if (!this.email.trim()) {
      this.erro = 'Informe o e-mail do cliente.';
      return;
    }

    if (!this.telefone.trim()) {
      this.erro = 'Informe o telefone do cliente.';
      return;
    }

    this.carregando = true;
    this.cdr.detectChanges();

    const token = localStorage.getItem('token');

    const dados = {
      name: this.nome,
      email: this.email,
      phone: this.telefone
    };

    this.http.put(
      `https://localhost:7134/api/Users/clients/${this.id}`,
      dados,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigate(['/admin/clients']);
      },
      error: (error) => {
        this.carregando = false;

        if (error.status === 400) {
          this.erro = 'Este e-mail já está sendo utilizado.';
        } else {
          this.erro = 'Não foi possível atualizar o cliente.';
        }

        this.cdr.detectChanges();
        console.error('Erro ao atualizar cliente:', error);
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/admin/clients']);
  }
}
