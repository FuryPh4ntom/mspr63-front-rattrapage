import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  message = '';

  private adminEmail = 'WildLens';
  private adminPassword = 'Wild@Lens/2025'; 
  constructor(private http: HttpClient, private router: Router) {}

  login() {
    localStorage.removeItem('admin');
  
    if (this.email === this.adminEmail && this.password === this.adminPassword) {
      localStorage.setItem('admin', 'true'); 
      this.router.navigate(['/dashboard']);  
      return;
    }
  
    const user = {
      email: this.email,
      password: this.password
    };
  
    this.http.post<{ message: string, nom: string, prenom: string, email: string }>('http://localhost:3000/api/auth/login', user).subscribe({
      next: (response) => {
        localStorage.setItem('token', 'true');
        localStorage.setItem('nom', response.nom);
        localStorage.setItem('prenom', response.prenom);
        localStorage.setItem('email', response.email);
        
        this.router.navigate(['/profil']);
      },
      error: (err) => {
        this.message = err.error.message || 'Erreur lors de la connexion';
      }
    });
  }
}
