import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
})
export class Appointments {

  private router = inject(Router);

  voltar() {
    this.router.navigate(['/home']);
  }

}
