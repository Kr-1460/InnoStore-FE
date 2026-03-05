import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsList } from '../../components/transactions-list/transactions-list';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-transactions',
  imports: [
    TransactionsList,
    CommonModule
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
})
export class TransactionsPage {
  private authService = inject(AuthService);
    
  protected user$ = this.authService.user$;
}
