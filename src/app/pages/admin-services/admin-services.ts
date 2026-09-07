import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-services.html',
  styleUrl: './admin-services.css',
})
export class AdminServices implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  servicos: any[] = [];
  carregando = true;

  ngOnInit(): void {
    this.carregarServicos();
  }

  carregarServicos(): void {
    const token = localStorage.getItem('token');

    this.http.get<any[]>(
      'https://localhost:7134/api/Services',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: (response) => {
        this.servicos = response;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.carregando = false;
        console.error('Erro ao carregar serviços:', error);
        this.cdr.detectChanges();
      }
    });
  }

  excluir(id: string): void {
    const confirmar = confirm(
      'Tem certeza que deseja excluir este serviço?'
    );

    if (!confirmar) {
      return;
    }

    const token = localStorage.getItem('token');

    this.http.delete(
      `https://localhost:7134/api/Services/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: () => {
        this.servicos = this.servicos.filter(
          servico => servico.id !== id
        );

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao excluir serviço:', error);
      }
    });
  }
}
