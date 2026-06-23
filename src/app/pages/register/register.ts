import { Component, inject} from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private router = inject(Router);

  irParaLogin() {
  this.router.navigate(['/login'])
}
}
