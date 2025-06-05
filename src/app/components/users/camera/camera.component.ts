import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit, AfterViewInit {
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;

  canvasElement!: HTMLCanvasElement;
  context!: CanvasRenderingContext2D;
  photoUrl: string | null = null;
  analyses: any[] = [];

  email: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.canvasElement = document.createElement('canvas');
    this.context = this.canvasElement.getContext('2d')!;
    this.email = localStorage.getItem('email') || '';
  }

  ngAfterViewInit(): void {
    const isLocalhost = location.hostname === 'localhost';
    const isSecure = location.protocol === 'https:';

    if (!isSecure && !isLocalhost) {
      alert("La caméra nécessite une connexion HTTPS ou localhost.");
      return;
    }

    this.startCamera();
  }

  startCamera(): void {
  if (!navigator.mediaDevices?.getUserMedia) {
    console.error("getUserMedia n'est pas supporté par ce navigateur.");
    return;
  }

  const video = this.videoRef?.nativeElement;

  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
      if (video) {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play().catch(err => console.error("Erreur lors de la lecture vidéo :", err));
        };
      }
    })
    .catch(err => {
      console.error('Erreur lors de l’accès à la caméra :', err);
      if (err.name === 'NotAllowedError') {
        alert("L'accès à la caméra a été refusé. Veuillez l'autoriser dans les paramètres du navigateur.");
      } else if (err.name === 'NotFoundError') {
        alert("Aucune caméra n'a été trouvée sur cet appareil.");
      }
    });
  }

  stopCamera(): void {
    const stream = this.videoRef?.nativeElement?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    this.videoRef.nativeElement.srcObject = null;
  }

  capturePhoto(): void {
    const video = this.videoRef.nativeElement;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    this.canvasElement.width = width;
    this.canvasElement.height = height;

    this.context.drawImage(video, 0, 0, width, height);

    this.photoUrl = this.canvasElement.toDataURL('image/png');
    console.log('Photo capturée (base64) :', this.photoUrl);

    this.showRandomSpecies(this.photoUrl);
  }

  showRandomSpecies(photo: string): void {
  this.http.post<any>('http://localhost:3000/api/especes/classify', { photo })
    .subscribe(response => {
      if (response.match) {
        const speciesData = response.data;
        const analysis = {
          photo,
          species: speciesData.espece,
          description: speciesData.description,
          nomLatin: speciesData.nomLatin,
          famille: speciesData.famille,
          taille: speciesData.taille,
          region: speciesData.region,
          habitat: speciesData.habitat,
          funFact: speciesData.funFact,
          image: speciesData.image
        };

        this.analyses.unshift(analysis);

        this.http.post('http://localhost:3000/api/scans/userscan', {
          photo,
          especeDetectee: speciesData.espece,
          email: this.email
        }).subscribe({
          next: () => console.log('Scan enregistré'),
          error: err => console.error('Erreur enregistrement scan:', err)
        });
      } else {
        this.analyses.unshift({
          photo,
          species: `Espèce inconnue (${response.predicted_species})`,
          description: 'Espèce non reconnue dans notre base de données.',
        });
      }
    }, error => {
      console.error('Erreur classification :', error);
    });
  }

  removePhoto(): void {
    this.photoUrl = null;
    this.analyses = [];
    this.startCamera();
  }
}
