import { Injectable, inject } from "@angular/core";
import { TransactionDTO, TransactionService } from "../core/generated";
import { map, Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class TransactionsService {
    private readonly transactionService: TransactionService = inject(TransactionService);

    getTransactions(searchFilter: TransactionSearchFilter): Observable<Transaction[]> {
        const observable = this.transactionService.apiTransactionGet(
            searchFilter.userId,
            searchFilter.pageNumber,
            searchFilter.pageSize,
        ).pipe(map(transactionDTOs =>
            transactionDTOs.map(x => this.mapTransactionDtoToTransaction(x)))
        );

        return observable;
    }

    private mapTransactionDtoToTransaction(transactionDTO: TransactionDTO): Transaction {
        const amount = Number(transactionDTO.amount);

        const transaction: Transaction = {
            amount: amount,
            date: transactionDTO.createdAt,
            description: amount > 0 ? 'Пополнение' : amount < 0 ? 'Списание' : 'Чаво',
        }

        return transaction;
    }
}

export interface Transaction {
  amount: number;
  description: string;
  date: Date;
}

export interface TransactionSearchFilter {
    pageNumber: number;
    pageSize: number;
    userId: string;
}