import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

export interface TransactionFilters {
  startDate: Date | null;
  endDate: Date | null;
  type: 'all' | 'replenishment' | 'writeOff';
  description: string | null;
}

export const DEFAULT_FILTERS: TransactionFilters = {
  startDate: null,
  endDate: null,
  type: 'all',
  description: null
}

@Component({
  selector: 'app-transactions-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions-filter.html',
  styleUrl: './transactions-filter.scss',
})
export class TransactionsFilterComponent {
  dialogRef = inject(DialogRef<TransactionFilters>);

  filterData = { ...inject<TransactionFilters>(DIALOG_DATA) }

  apply() {
    this.dialogRef.close(this.filterData);
  }

  reset() {
    this.filterData = { ...DEFAULT_FILTERS };
  }
}
