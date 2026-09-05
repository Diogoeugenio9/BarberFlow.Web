import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
})
export class Appointments implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private auth = inject(Auth);

  barbeiros: any[] = [];
  services: any[] = [];
  horarios: string[] = [];

  selectedBarberId = '';
  selectedServiceId = '';
  selectedDate = '';
  selectedTime = '';

  mensagem = '';
  tipoMensagem = '';

  ngOnInit(): void {
    this.http.get('https://localhost:7134/api/Barbers').subscribe({
      next: (response: any) => {
        this.barbeiros = response;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Erro ao carregar barbeiros:', error);
      }
    });

    this.http.get('https://localhost:7134/api/Services').subscribe({
      next: (response: any) => {
        this.services = response;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Erro ao carregar serviços:', error);
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['serviceId']) {
        this.selectedServiceId = params['serviceId'];
      }

      if (params['barberId']) {
        this.selectedBarberId = params['barberId'];
      }

      if (this.selectedBarberId && this.selectedDate) {
        this.buscarHorariosDisponiveis();
      }
    });
  }

  buscarHorariosDisponiveis(): void {
    this.selectedTime = '';

    if (!this.selectedBarberId || !this.selectedDate) {
      this.horarios = [];
      return;
    }

    this.http.get<string[]>(
      `https://localhost:7134/api/Appointments/available?barberId=${this.selectedBarberId}&date=${this.selectedDate}`
    ).subscribe({
      next: (response) => {
        let horariosDisponiveis = response.map(horario =>
          horario.substring(0, 5)
        );

        const hoje = new Date();
        const dataSelecionada = new Date(`${this.selectedDate}T00:00:00`);

        if (
          dataSelecionada.getFullYear() === hoje.getFullYear() &&
          dataSelecionada.getMonth() === hoje.getMonth() &&
          dataSelecionada.getDate() === hoje.getDate()
        ) {
          const horarioAtual = hoje.getHours() * 60 + hoje.getMinutes();

          horariosDisponiveis = horariosDisponiveis.filter(horario => {
            const [hora, minuto] = horario.split(':').map(Number);
            const horarioEmMinutos = hora * 60 + minuto;

            return horarioEmMinutos > horarioAtual;
          });
        }

        this.horarios = horariosDisponiveis;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.horarios = [];
        console.log('Erro ao carregar horários:', error);
      }
    });
  }

  voltar(): void {
    const origem = this.route.snapshot.queryParams['from'];

    if (origem === 'home') {
      this.router.navigate(['/home']);
      return;
    }

    if (origem === 'services') {
      this.router.navigate(['/services']);
      return;
    }

    if (origem === 'appointments') {
      this.router.navigate(['/appointments']);
      return;
    }

    this.router.navigate(['/appointments']);
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

  confirmarAgendamento(): void {
    if (!this.selectedBarberId) {
      this.mostrarMensagem('Selecione um barbeiro.', 'erro');
      return;
    }

    if (!this.selectedServiceId) {
      this.mostrarMensagem('Selecione um serviço.', 'erro');
      return;
    }

    if (!this.selectedDate) {
      this.mostrarMensagem('Selecione uma data.', 'erro');
      return;
    }

    if (!this.selectedTime) {
      this.mostrarMensagem('Selecione um horário.', 'erro');
      return;
    }

    const appointmentDate = `${this.selectedDate}T${this.selectedTime}`;

    const userName = this.auth.getUserName();

    const appointment = {
      clientName: userName,
      appointmentDate: appointmentDate,
      barberId: this.selectedBarberId,
      serviceId: this.selectedServiceId
    };

    const token = localStorage.getItem('token');

    this.http.post(
      'https://localhost:7134/api/Appointments',
      appointment,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: (response) => {
        console.log(response);

        this.mostrarMensagem(
          'Agendamento realizado com sucesso!',
          'sucesso'
        );

        this.selectedBarberId = '';
        this.selectedServiceId = '';
        this.selectedDate = '';
        this.selectedTime = '';
        this.horarios = [];

        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 3000);
      },
      error: (error) => {
        console.error(error);

        this.mostrarMensagem(
          'Erro ao realizar agendamento.',
          'erro'
        );
      }
    });
  }
}
