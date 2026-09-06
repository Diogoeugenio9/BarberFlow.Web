import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-barber-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-barber-form.html',
  styleUrl: './admin-barber-form.css',
})
export class AdminBarberForm implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  id = '';

  nome = '';
  email = '';
  telefone = '';
  especialidade = '';

  carregando = false;
  carregandoDados = false;
  erro = '';

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';

    if (this.id) {
      this.carregarBarbeiro();
    }
  }

  carregarBarbeiro(): void {
    this.carregandoDados = true;

    const token = localStorage.getItem('token');

    this.http.get<any>(
      `https://localhost:7134/api/Barbers/${this.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: (response) => {
        this.nome = response.name;
        this.email = response.email;
        this.telefone = response.phone;
        this.especialidade = response.specialty;

        this.carregandoDados = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.carregandoDados = false;
        this.erro = 'Não foi possível carregar o barbeiro.';
        this.cdr.detectChanges();
        console.error('Erro ao carregar barbeiro:', error);
      }
    });
  }

  salvar(): void {
    this.erro = '';

    if (!this.nome.trim()) {
      this.erro = 'Informe o nome do barbeiro.';
      return;
    }

    if (!this.email.trim()) {
      this.erro = 'Informe o e-mail do barbeiro.';
      return;
    }

    if (!this.telefone.trim()) {
      this.erro = 'Informe o telefone do barbeiro.';
      return;
    }

    this.carregando = true;
    this.cdr.detectChanges();

    const token = localStorage.getItem('token');

    const dados = {
      name: this.nome,
      email: this.email,
      phone: this.telefone,
      specialty: this.especialidade
    };

    if (this.id) {
      this.http.put(
        `https://localhost:7134/api/Barbers/${this.id}`,
        dados,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      ).subscribe({
        next: () => {
          this.carregando = false;
          this.router.navigate(['/admin/barbers']);
        },
        error: (error) => {
          this.carregando = false;
          this.erro = 'Não foi possível atualizar o barbeiro.';
          this.cdr.detectChanges();
          console.error('Erro ao atualizar barbeiro:', error);
        }
      });

      return;
    }

    this.http.post(
      'https://localhost:7134/api/Barbers',
      dados,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigate(['/admin/barbers']);
      },
      error: (error) => {
        this.carregando = false;
        this.erro = 'Não foi possível cadastrar o barbeiro.';
        this.cdr.detectChanges();
        console.error('Erro ao cadastrar barbeiro:', error);
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/admin/barbers']);
  }
}
