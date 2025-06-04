import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  get isAdmin(): boolean {
    return localStorage.getItem('admin') === 'true';
  }

  get isUser(): boolean {
    return localStorage.getItem('token') === 'true' && !this.isAdmin;
  }

  get isLoggedIn(): boolean {
    return this.isUser || this.isAdmin;
  }

  constructor(private router: Router) {}

  logout() {
    localStorage.clear();
    this.router.navigate(['/connexion']);
  }
}