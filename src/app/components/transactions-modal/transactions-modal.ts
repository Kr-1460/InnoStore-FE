import { Component, signal, input, output, computed, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '@auth0/auth0-angular';
import { ChevronRightIcon } from '../icons/chevron-right-icon/chevron-right-icon';
import { ArrowUpIcon } from '../icons/arrow-up-icon/arrow-up-icon';
import { ArrowDownIcon } from '../icons/arrow-down-icon/arrow-down-icon';
import { TransactionsList } from "../transactions-list/transactions-list";

@Component({
  selector: 'app-transactions-modal',
  standalone: true,
  imports: [CommonModule, RouterLink, ChevronRightIcon, ArrowUpIcon, ArrowDownIcon, TransactionsList],
  templateUrl: './transactions-modal.html',
  styleUrl: './transactions-modal.scss',
})
export class TransactionsModal {
  isOpen = input.required<boolean>();
  userDetails = input<User | null | undefined>(null);
  
  closeModal = output<void>();

  private authService = inject(AuthService);

  protected readonly userName = computed(() => this.userDetails()?.name || 'Пользователь');
  protected readonly userTitle = computed(() => this.userDetails()?.email || '');

  protected onCloseClick(): void {
    this.closeModal.emit();
  }

  protected logout(): void {
    this.authService.logout({ 
      logoutParams: { 
        returnTo: window.location.origin 
      } 
    });
  }
}