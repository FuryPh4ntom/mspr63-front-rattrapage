import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  selector: 'app-scan-list',
  templateUrl: './scan-list.component.html',
  styleUrls: ['./scan-list.component.css']
})
export class ScanListComponent implements OnInit {
  scans: any[] = [];
  totalScans: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadScans(this.currentPage);
  }

  loadScans(page: number): void {
    this.http.get<any>(`http://localhost:3000/api/scans/all?page=${page}`).subscribe({
      next: (response) => {
        this.scans = response.scans;
        this.totalScans = response.total;
        this.currentPage = page;
      },
      error: (err) => {
        console.error('Erreur chargement scans :', err);
      }
    });
  }

  get totalPages(): number[] {
    return Array(Math.ceil(this.totalScans / this.itemsPerPage))
      .fill(0)
      .map((x, i) => i + 1);
  }
}
