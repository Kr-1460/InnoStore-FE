import { Component, signal, input, output, computed, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, User } from '@auth0/auth0-angular';
import { ChevronRightIcon } from '../icons/chevron-right-icon/chevron-right-icon';
import { ArrowUpIcon } from '../icons/arrow-up-icon/arrow-up-icon';
import { ArrowDownIcon } from '../icons/arrow-down-icon/arrow-down-icon';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

@Component({
  selector: 'app-transactions-modal',
  standalone: true,
  imports: [CommonModule, RouterLink, ChevronRightIcon, ArrowUpIcon, ArrowDownIcon],
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

  protected readonly transactions = signal<Transaction[]>([
    {
      id: 1,
      description: 'Покупка эко-бутылки',
      amount: 40,
      type: 'expense',
      date: '2024-01-15'
    },
    {
        id: 2,
        description: 'Прохождение профессионального курса',
        amount: 50,
        type: 'income',
        date: '2024-01-10'
    },
    {
        id: 3,
        description: 'Организация мероприятия',
        amount: 40,
        type: 'income',
        date: '2024-01-05'
    },
        {
        id: 3,
        description: 'Организация мероприятия',
        amount: 40,
        type: 'income',
        date: '2024-01-05'
    },
        {
        id: 3,
        description: 'Организация мероприятия',
        amount: 40,
        type: 'income',
        date: '2024-01-05'
    },
        {
        id: 3,
        description: 'Организация мероприятия',
        amount: 40,
        type: 'income',
        date: '2024-01-05'
    },
        {
        id: 3,
        description: 'Организация мероприятия',
        amount: 40,
        type: 'income',
        date: '2024-01-05'
    },
        {
        id: 3,
        description: 'Организация мероприятия',
        amount: 40,
        type: 'income',
        date: '2024-01-05'
    },
  ]);

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