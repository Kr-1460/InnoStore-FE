import { Component, effect, inject, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { TransactionFilters, DEFAULT_FILTERS, TransactionsFilterComponent } from '../transactions-filter/transactions-filter';

interface Transaction {
  amount: number;
  description: string;
  date: Date;
}

@Component({
  selector: 'app-transactions-list',
  imports: [CommonModule, DialogModule],
  templateUrl: './transactions-list.html',
  styleUrl: './transactions-list.scss',
})
export class TransactionsList {

  private dialog = inject(Dialog);

  private filters = signal<TransactionFilters>({ ...DEFAULT_FILTERS });

  currentTransactions = computed(() =>
    this.allTransactions().filter(x =>
      this.filterTransaction(x, this.filters())
  ));

  allTransactions = input<Transaction[]>([
    {
      amount: -3,
      description: 'Списание',
      date: new Date(2002, 12, 1),
    },
    {
      amount: 5,
      description: 'Пополнение',
      date: new Date(2042, 2, 15),
    },
    {
      amount: 5,
      description: 'Пополнение',
      date: new Date(2042, 2, 15),
    },    {
      amount: 5,
      description: 'Пополнение',
      date: new Date(2042, 2, 15),
    },
    {
      amount: -3,
      description: 'Списание',
      date: new Date(2002, 12, 1),
    },    {
      amount: -3,
      description: 'Списание',
      date: new Date(2002, 12, 1),
    },    {
      amount: -3,
      description: 'Списание',
      date: new Date(2002, 12, 1),
    },    {
      amount: -3,
      description: 'Списание',
      date: new Date(2002, 12, 1),
    },
    {
      amount: 5,
      description: 'Пополнение',
      date: new Date(2042, 2, 15),
    },
    {
      amount: 5,
      description: 'Пополнение',
      date: new Date(2042, 2, 15),
    },
    {
      amount: 5,
      description: 'Пополнение',
      date: new Date(2042, 2, 15),
    },    {
      amount: 5,
      description: 'Пополнение',
      date: new Date(2042, 2, 15),
    },    {
      amount: 5,
      description: 'Пополнение',
      date: new Date(2042, 2, 15),
    },
  ]);

  public replenishmentIcon = 'assets/images/replenishment.png';

  public writeOffIcon = 'assets/images/write-off.png';

  openFilters() {
    const dialogRef = this.dialog.open<TransactionFilters>(
      TransactionsFilterComponent,
      {
        data: this.filters(),
      }
    );

    dialogRef.closed.subscribe((result) => {

      if (result === undefined) {
        if (!this.areFiltersApplied()) {
          this.filters.set({ startDate: null, endDate: null, type: 'all', description: null });
        }

        return;
      }

        this.filters.set(result!);
      }
    );
  }

  private filterTransaction(transaction: Transaction, filters: TransactionFilters): boolean {

    if (filters.startDate != null && transaction.date < new Date(filters.startDate))
    {
      return false;
    }

    if (filters.endDate != null && transaction.date > new Date(filters.endDate))
    {
      return false;
    }

    if (filters.description != null && !transaction.description.toLowerCase().includes(filters.description.toLowerCase()))
    {
      return false;
    }

    return true;
  }

  private areFiltersApplied(): boolean {
    return JSON.stringify(this.filters()) !== JSON.stringify(DEFAULT_FILTERS);
  }
}