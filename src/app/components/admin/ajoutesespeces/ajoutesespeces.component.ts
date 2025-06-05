import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  selector: 'app-ajoutesespeces',
  templateUrl: './ajoutesespeces.component.html',
  styleUrls: ['./ajoutesespeces.component.css'],
})
export class AjoutesespecesComponent {
  especeData = {
    espece: '',
    description: '',
    nomLatin: '',
    famille: '',
    taille: '',
    region: '',
    habitat: '',
    funFact: '',
    image: ''
  };

  familles = ['Mammifères', 'Oiseaux', 'Reptiles', 'Amphibiens', 'Poissons', 'Insectes'];
  message = '';

  constructor(private http: HttpClient) {}

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.especeData.image = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  ajouterEspece(): void {
    this.http.post('http://localhost:3000/api/especes', this.especeData)
      .subscribe({
        next: response => {
          this.message = 'Espèce ajoutée avec succès !';
        },
        error: err => {
          this.message = 'Erreur lors de l\'ajout.';
          console.error(err);
        }
      });
  }
}