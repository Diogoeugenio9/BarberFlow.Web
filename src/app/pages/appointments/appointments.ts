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

    });

  }

  buscarHorariosDisponiveis() {
  if (!this.selectedBarberId || !this.selectedDate) {
    return;
  }

  this.http.get(
    `https://localhost:7134/api/Appointments/available?barberId=${this.selectedBarberId}&date=${this.selectedDate}`
  ).subscribe({

    next: (response: any) => {
      this.horarios = response;
      this.cdr.detectChanges();
    },

    error: (error) => {
      console.log('Erro ao carregar horários:', error);
    }

  });
}

  voltar() {
    this.router.navigate(['/home']);
  }

  confirmarAgendamento() {

    if (!this.selectedBarberId) {
      alert('Selecione um barbeiro.');
      return;
    }

    if (!this.selectedServiceId) {
      alert('Selecione um serviço.');
      return;
    }

    if (!this.selectedDate) {
      alert('Selecione uma data.');
      return;
    }

    if (!this.selectedTime) {
      alert('Selecione um horário.');
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
        alert('Agendamento realizado com sucesso!');

        this.selectedBarberId = '';
        this.selectedServiceId = '';
        this.selectedDate = '';
        this.selectedTime = '';

        this.router.navigate(['/home']);
      },

      error: (error) => {
        console.error(error);
        alert('Erro ao realizar agendamento.');
      }

    });

  }

}
