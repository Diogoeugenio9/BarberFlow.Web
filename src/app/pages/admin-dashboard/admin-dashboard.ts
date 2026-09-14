import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private auth = inject(Auth);

  agendamentosHoje = 0;
  totalClientes = 0;
  totalBarbeiros = 0;
  totalServicos = 0;
  proximosAgendamentos: any[] = [];

  nomeAdmin: string | null = '';

  ngOnInit(): void {
    this.nomeAdmin = this.auth.getUserName();
    this.carregarDashboard();
  }

  carregarDashboard(): void {
    const token = localStorage.getItem('token');

    this.http.get<any>(
      'https://localhost:7134/api/Admin/dashboard',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: (response) => {
        this.agendamentosHoje = response.agendamentosHoje;
        this.totalClientes = response.totalClientes;
        this.totalBarbeiros = response.totalBarbeiros;
        this.totalServicos = response.totalServicos;
        this.proximosAgendamentos = response.proximosAgendamentos;

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar dashboard:', error);
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
