import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  especes: any[] = [];
  currentIndex: number = 0;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadEspeces();
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.especes.length;
    }, 5000); // défilement automatique toutes les 5 secondes
  }

  loadEspeces(): void {
    this.http.get<any>('http://localhost:3000/api/especes/all')
      .subscribe({
        next: (data) => this.especes = data,
        error: (err) => console.error('Erreur chargement espèces :', err)
      });
  }

  goToFiche(espece: string): void {
    this.router.navigate(['/fiche-espece', espece]);
  }
}
