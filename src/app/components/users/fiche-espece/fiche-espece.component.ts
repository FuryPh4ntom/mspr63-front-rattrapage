import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  selector: 'app-fiche-espece',
  templateUrl: './fiche-espece.component.html',
  styleUrls: ['./fiche-espece.component.css']
})
export class FicheEspeceComponent implements OnInit {
  espece: any = null;         // correspond à la variable utilisée dans le template
  especeName: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.especeName = params.get('espece') || '';
      if (this.especeName) {
        this.loadDetails();
      }
    });
  }

  loadDetails(): void {
    this.http.get(`http://localhost:3000/api/especes/nom/${encodeURIComponent(this.especeName)}`)
      .subscribe({
        next: (data) => this.espece = data,
        error: (err) => {
          console.error('Erreur chargement espèce :', err);
          this.espece = null;  // reset si erreur
        }
      });
  }
}
