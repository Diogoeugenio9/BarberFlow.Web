
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';


interface JwtPayload {
  unique_name: string;
  //Name: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private readonly TOKEN_KEY = 'token';

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserName(): string | null {
    const token = this.getToken();

    if(token == null){
      return null;
    }

    const decoded = jwtDecode<JwtPayload>(token);
    console.log(decoded)

    const userName = decoded.unique_name;

    return userName;
  }


  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
