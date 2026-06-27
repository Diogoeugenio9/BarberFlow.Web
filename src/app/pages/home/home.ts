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

  barbeiros: any[] = [];
  carregando = true;

  ngOnInit(): void {
    this.http.get('https://localhost:7134/api/Barbers').subscribe({
      next: (response: any) => {
        this.barbeiros = [...response];
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.carregando = false;
        console.log('Erro ao carregar barbeiros:', error);
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




}
