import { Component, inject, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
})
export class Appointments implements OnInit {

  private router = inject(Router);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef); //injetar ChangeDetectorRef para controlar detcçao de mudanças

  barbeiros: any[] = [];
  services: any[] = [];

  selectedBarberId = '';
  selectedServiceId = '';


  ngOnInit(): void {

  this.http.get('https://localhost:7134/api/Barbers').subscribe({

    next: (response: any) => {
      this.barbeiros = response;
      this.cdr.detectChanges(); // Forçar atualizaçao
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

}

  voltar() {
    this.router.navigate(['/home']);
  }

  confirmarAgendamento() {

  const appointment = {
  barberId: this.selectedBarberId,
  serviceId: this.selectedServiceId
};

console.log(appointment);

}
}
