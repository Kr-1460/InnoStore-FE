import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  
  protected readonly transactions = signal<Transaction[]>([]);
}
