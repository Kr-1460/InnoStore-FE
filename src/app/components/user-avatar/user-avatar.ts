import { Component, signal, effect, Inject, PLATFORM_ID, input, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TransactionsModal } from '../transactions-modal/transactions-modal';
import { AuthService } from '@auth0/auth0-angular';
import { ProfileDropdown } from '../profile-dropdown/profile-dropdown';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [CommonModule, TransactionsModal, ProfileDropdown],
  templateUrl: './user-avatar.html',
  styleUrl: './user-avatar.scss',
})
export class UserAvatar {

  userPoints = input<number>(100);

  protected readonly isModalOpen = signal(false);
  protected readonly isProfileDropdownOpen = signal(false);

  private authService = inject(AuthService);
  protected user$ = this.authService.user$;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {

    effect(() => {
      const anyMenuOpen = this.isModalOpen() || this.isProfileDropdownOpen();

      if (anyMenuOpen && isPlatformBrowser(this.platformId)) {
        setTimeout(() => {
          if (typeof document !== 'undefined') {
            document.addEventListener('click', this.handleOutsideClick);
          }
        }, 0);
      } else {
        if (isPlatformBrowser(this.platformId) && typeof document !== 'undefined') {
          document.removeEventListener('click', this.handleOutsideClick);
        }
      }
    });

  }

  private handleOutsideClick = (event: MouseEvent): void => {
    if (!isPlatformBrowser(this.platformId)) return;

    const target = event.target as HTMLElement;

    const profileDropdown = document.querySelector('.dropdown-content');
    const profileButton = document.querySelector('.profile-link');

    if (profileDropdown && profileButton &&
        !profileDropdown.contains(target) &&
        !profileButton.contains(target)) {
      this.closeProfileDropdown();
    }

    const transactionsButton = document.querySelector('.transactions-button');
    if (transactionsButton && !transactionsButton.contains(target)) {
      this.closeModal();
    }
  };

  protected toggleMenus(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const newState = !this.isProfileDropdownOpen();
    this.isProfileDropdownOpen.set(newState);
    this.isModalOpen.set(newState);
  }

  protected openModal(): void { this.isModalOpen.set(true); }
  protected closeModal(): void { this.isModalOpen.set(false); }

  protected closeProfileDropdown(): void { this.isProfileDropdownOpen.set(false); }

  protected closeAllMenus(): void {
    this.closeModal();
    this.closeProfileDropdown();
  }
}