import { Component, signal, effect, Inject, PLATFORM_ID, input } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TransactionsModal } from '../transactions-modal/transactions-modal';

@Component({
  selector: 'app-user-avatar',
  imports: [CommonModule, TransactionsModal],
  templateUrl: './user-avatar.html',
  styleUrl: './user-avatar.scss',
})
export class UserAvatar {
  userPoints = input<number>(100);
  protected readonly isModalOpen = signal(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    effect(() => {
      if (this.isModalOpen() && isPlatformBrowser(this.platformId)) {
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
    if (!isPlatformBrowser(this.platformId) || typeof document === 'undefined') {
      return;
    }
    
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.dropdown-content');
    const profileButton = document.querySelector('.profile-link');
    
    if (dropdown && profileButton) {
      if (!dropdown.contains(target) && !profileButton.contains(target)) {
        this.closeModal();
      }
    }
  };

  protected openModal(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.isModalOpen.set(!this.isModalOpen());
  }

  protected closeModal(): void {
    this.isModalOpen.set(false);
  }
}
