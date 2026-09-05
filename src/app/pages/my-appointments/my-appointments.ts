import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-appointments.html',
  styleUrl: './my-appointments.css',
})
export class MyAppointments implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  agendamentos: any[] = [];
  carregando = true;

  ngOnInit(): void {
    this.carregarAgendamentos();
  }

  carregarAgendamentos(): void {
    const token = localStorage.getItem('token');

    this.http.get<any[]>(
      'https://localhost:7134/api/Appointments',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: (response) => {
        this.agendamentos = response;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.carregando = false;
        console.error('Erro ao carregar agendamentos:', error);
      }
    });
  }

  novoAgendamento(): void {
    this.router.navigate(['/appointments/new']);
  }

  voltar(): void {
    this.router.navigate(['/home']);
  }
}
