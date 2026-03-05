import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transactions-list-item',
  imports: [CommonModule],
  templateUrl: './transactions-list-item.html',
  styleUrl: './transactions-list-item.scss',
})
export class TransactionsListItem {
  public amount = input<number>(0);

  public date = input<Date>();

  public description = input<string>("");

  public replenishmentIcon = 'assets/images/replenishment.png';

  public writeOffIcon = 'assets/images/write-off.png';
}