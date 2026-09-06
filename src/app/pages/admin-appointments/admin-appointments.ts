import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-appointments',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-appointments.html',
  styleUrl: './admin-appointments.css',
})
export class AdminAppointments implements OnInit {
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
      'https://localhost:7134/api/Appointments/admin',
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
}
