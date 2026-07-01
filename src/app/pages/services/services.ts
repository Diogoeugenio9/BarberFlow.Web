import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services implements OnInit {

  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  services: any[] = [];

  carregando = true;

  ngOnInit(): void {

    this.http.get('https://localhost:7134/api/Services').subscribe({

      next: (response: any) => {

        this.services = [...response];

        this.carregando = false;

        this.cdr.detectChanges();

      },

      error: (error) => {

        this.carregando = false;

        console.log('Erro ao carregar serviços:', error);

      }



    });




  }
  voltar() {
  this.router.navigate(['/home']);
}

irParaAppointments(serviceId: string) {
  this.router.navigate(
    ['/appointments'],
    {
      queryParams: {
        serviceId: serviceId
      }
    }
  );
}



}
