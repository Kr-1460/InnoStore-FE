import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { ProfileIcon } from '../icons/profile-icon/profile-icon';
import { CartIcon } from '../icons/cart-icon/cart-icon';
import { AboutIcon } from '../icons/about-icon/about-icon';
import { logoutIcon } from '../icons/logout-icon/logout-icon';
import { AdminIcon } from '../icons/admin-icon/admin-icon';

@Component({
  selector: 'app-profile-dropdown',
  standalone: true,
  imports: [CommonModule, ProfileIcon, CartIcon, AboutIcon, logoutIcon, AdminIcon],
  templateUrl: './profile-dropdown.html',
  styleUrl: './profile-dropdown.scss',
})
export class ProfileDropdown {
  userDetails = input<any>(null);
  userPoints = input<number>(0);

  isOpen = signal(true);

  private router = inject(Router);
  private auth = inject(AuthService);

  close() {
    this.isOpen.set(false);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
    this.close();
  }

  goToCart() {
    this.router.navigate(['/cart']);
    this.close();
  }

  goToAbout() {
    this.router.navigate(['/about']);
    this.close();
  }

  goToAdminPanel() {
    this.router.navigate(['/admin-panel']);
    this.close();
  }

  logout() {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}