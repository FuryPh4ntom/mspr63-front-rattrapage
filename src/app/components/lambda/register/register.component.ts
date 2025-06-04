import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nom = '';
  prenom = '';
  email = '';
  password = '';
  message = '';

  constructor(private http: HttpClient) {}

  register() {
    const user = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:3000/api/auth/register', user).subscribe({
      next: () => this.message = 'Inscription réussie !',
      error: err => this.message = err.error.message || 'Erreur lors de l\'inscription.'
    });
  }
}
