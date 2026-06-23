import { Component, inject } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  private router = inject(Router);

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


