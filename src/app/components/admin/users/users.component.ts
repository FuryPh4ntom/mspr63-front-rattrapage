import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
interface User {
  email: string;
  nom: string;
  prenom: string;
  createdAt: string;
  scanCount: number;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  page: number = 1;
  totalPages: number = 1;
  loading: boolean = false;
  error: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers(this.page);
  }

  loadUsers(page: number) {
    this.loading = true;
    this.error = '';
    this.http.get<any>(`http://localhost:3000/api/auth/users?page=${page}`).subscribe({
      next: (res) => {
        this.users = res.users;
        this.page = res.page;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des utilisateurs.';
        this.loading = false;
      }
    });
  }

  previousPage() {
    if (this.page > 1) {
      this.loadUsers(this.page - 1);
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.loadUsers(this.page + 1);
    }
  }
}
