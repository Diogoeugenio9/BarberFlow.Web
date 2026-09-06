import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-barbers',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-barbers.html',
  styleUrl: './admin-barbers.css',
})
export class AdminBarbers implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  barbeiros: any[] = [];
  carregando = true;

  ngOnInit(): void {
    this.carregarBarbeiros();
  }

  carregarBarbeiros(): void {
    const token = localStorage.getItem('token');

    this.http.get<any[]>(
      'https://localhost:7134/api/Barbers',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: (response) => {
        this.barbeiros = response;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.carregando = false;
        console.error('Erro ao carregar barbeiros:', error);
      }
    });
  }

  excluir(id: string): void {
    const confirmar = confirm(
      'Tem certeza que deseja excluir este barbeiro?'
    );

    if (!confirmar) {
      return;
    }

    const token = localStorage.getItem('token');

    this.http.delete(
      `https://localhost:7134/api/Barbers/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: () => {
        this.barbeiros = this.barbeiros.filter(
          barbeiro => barbeiro.id !== id
        );

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao excluir barbeiro:', error);
      }
    });
  }
}
