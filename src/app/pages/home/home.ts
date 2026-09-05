import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  private router = inject(Router);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  proximoAgendamento: any = null;
  carregando = true;

  ngOnInit(): void {
    this.carregarAgendamento();
  }


  carregarAgendamento(): void {
    this.http.get<any[]>('https://localhost:7134/api/Appointments').subscribe({
      next: (response) => {
        const agora = new Date();

        const agendamentosFuturos = response
          .filter(agendamento => new Date(agendamento.appointmentDate) >= agora)
          .sort(
            (a, b) =>
              new Date(a.appointmentDate).getTime() -
              new Date(b.appointmentDate).getTime()
          );

        this.proximoAgendamento = agendamentosFuturos.length > 0
          ? agendamentosFuturos[0]
          : null;

        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.carregando = false;
        console.log('Erro ao carregar agendamento:', error);
      }
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }

  irParaCadastro() {
    this.router.navigate(['/register']);
  }

  irParaServices() {
    this.router.navigate(['/services']);
  }

  irParaAppointments() {
    this.router.navigate(['/appointments']);
  }

  irParaNovoAgendamento() {
  this.router.navigate(['/appointments/new']);
}
}
