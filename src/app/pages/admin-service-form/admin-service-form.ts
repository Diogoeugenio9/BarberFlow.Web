import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-service-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-service-form.html',
  styleUrl: './admin-service-form.css',
})
export class AdminServiceForm implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  id = '';

  nome = '';
  preco: number | null = null;
  duracao: number | null = null;

  carregando = false;
  carregandoDados = false;
  erro = '';

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';

    if (this.id) {
      this.carregarServico();
    }
  }

  carregarServico(): void {
    this.carregandoDados = true;

    const token = localStorage.getItem('token');

    this.http.get<any>(
      `https://localhost:7134/api/Services/${this.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: (response) => {
        this.nome = response.name;
        this.preco = response.price;
        this.duracao = response.durationInMinutes;

        this.carregandoDados = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.carregandoDados = false;
        this.erro = 'Não foi possível carregar o serviço.';
        this.cdr.detectChanges();
        console.error('Erro ao carregar serviço:', error);
      }
    });
  }

  salvar(): void {
    this.erro = '';

    if (!this.nome.trim()) {
      this.erro = 'Informe o nome do serviço.';
      return;
    }

    if (this.preco === null || this.preco < 0) {
      this.erro = 'Informe um preço válido.';
      return;
    }

    if (this.duracao === null || this.duracao <= 0) {
      this.erro = 'Informe uma duração válida.';
      return;
    }

    this.carregando = true;
    this.cdr.detectChanges();

    const token = localStorage.getItem('token');

    const dados = {
      name: this.nome,
      price: this.preco,
      durationInMinutes: this.duracao
    };

    if (this.id) {
      this.http.put(
        `https://localhost:7134/api/Services/${this.id}`,
        dados,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      ).subscribe({
        next: () => {
          this.carregando = false;
          this.router.navigate(['/admin/services']);
        },
        error: (error) => {
          this.carregando = false;
          this.erro = 'Não foi possível atualizar o serviço.';
          this.cdr.detectChanges();
          console.error('Erro ao atualizar serviço:', error);
        }
      });

      return;
    }

    this.http.post(
      'https://localhost:7134/api/Services',
      dados,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigate(['/admin/services']);
      },
      error: (error) => {
        this.carregando = false;
        this.erro = 'Não foi possível cadastrar o serviço.';
        this.cdr.detectChanges();
        console.error('Erro ao cadastrar serviço:', error);
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/admin/services']);
  }
}
