import { Component, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

@Component({
  selector: 'app-transactions-modal',
  imports: [CommonModule, RouterLink],
  templateUrl: './transactions-modal.html',
  styleUrl: './transactions-modal.scss',
})
export class TransactionsModal {
  isOpen = input.required<boolean>();
  closeModal = output<void>();

  protected readonly userName = signal('Марков Константин');
  protected readonly userTitle = signal('Power Platform developer');
  
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
      id: 4,
      description: 'Подарок на День Рождения',
      amount: 25,
      type: 'income',
      date: '2023-12-28'
    },
    {
      id: 5,
      description: 'Новогодний бонус',
      amount: 30,
      type: 'income',
      date: '2023-12-25'
    },
    {
      id: 6,
      description: 'Покупка толстовки лимитированной серии дизайн 2026 года',
      amount: 200,
      type: 'expense',
      date: '2023-12-20'
    }
  ]);

  protected onCloseClick(): void {
    this.closeModal.emit();
  }
}
