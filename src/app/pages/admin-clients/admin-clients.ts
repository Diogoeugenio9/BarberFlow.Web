import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-clients',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-clients.html',
  styleUrl: './admin-clients.css',
})
export class AdminClients implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  clientes: any[] = [];
  carregando = true;

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    const token = localStorage.getItem('token');

    this.http.get<any[]>(
      'https://localhost:7134/api/Users/clients',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: (response) => {
        this.clientes = response;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.carregando = false;
        console.error('Erro ao carregar clientes:', error);
        this.cdr.detectChanges();
      }
    });
  }

  editar(id: string): void {
    this.router.navigate(['/admin/clients/edit', id]);
  }

  excluir(id: string): void {
    const confirmar = confirm(
      'Tem certeza que deseja excluir este cliente?'
    );

    if (!confirmar) {
      return;
    }

    const token = localStorage.getItem('token');

    this.http.delete(
      `https://localhost:7134/api/Users/clients/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: () => {
        this.clientes = this.clientes.filter(
          cliente => cliente.id !== id
        );

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao excluir cliente:', error);
      }
    });
  }
}
