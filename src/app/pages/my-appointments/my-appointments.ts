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

  mensagem = '';
  tipoMensagem = '';

  mostrarModal = false;
  agendamentoSelecionadoId = '';

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

  mostrarMensagem(mensagem: string, tipo: string): void {
    this.mensagem = mensagem;
    this.tipoMensagem = tipo;

    this.cdr.detectChanges();

    setTimeout(() => {
      this.mensagem = '';
      this.tipoMensagem = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  abrirModalCancelamento(id: string): void {
    this.agendamentoSelecionadoId = id;
    this.mostrarModal = true;
    this.cdr.detectChanges();
  }

  fecharModalCancelamento(): void {
    this.mostrarModal = false;
    this.agendamentoSelecionadoId = '';
    this.cdr.detectChanges();
  }

  confirmarCancelamento(): void {
    const id = this.agendamentoSelecionadoId;

    this.fecharModalCancelamento();

    const token = localStorage.getItem('token');

    this.http.put(
      `https://localhost:7134/api/Appointments/${id}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: () => {
        this.mostrarMensagem(
          'Agendamento cancelado com sucesso!',
          'sucesso'
        );

        this.carregarAgendamentos();
      },
      error: (error) => {
        console.error('Erro ao cancelar agendamento:', error);

        this.mostrarMensagem(
          'Erro ao cancelar agendamento.',
          'erro'
        );
      }
    });
  }

  novoAgendamento(): void {
    this.router.navigate(
      ['/appointments/new'],
      {
        queryParams: {
          from: 'appointments'
        }
      }
    );
  }

  voltar(): void {
    this.router.navigate(['/home']);
  }
}
