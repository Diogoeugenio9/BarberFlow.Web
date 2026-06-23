import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  private router = inject(Router);
  private http = inject(HttpClient);

  ngOnInit(): void {

  this.http.get(
    'https://localhost:7134/api/Barbers'
  ).subscribe({
    next: (response) => {
      console.log('Barbeiros:', response);
    },
    error: (error) => {
      console.log('Erro:', error);
    }
  });

}

  exibirMensagem() {
  console.log('Botao clicado com sucesso');

}

irParaLogin() {
  this.router.navigate(['/login'])
}

irParaCadastro() {
  this.router.navigate(['/register'])
}
}


