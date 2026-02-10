import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inno-store-chip',
  imports: [FormsModule],
  templateUrl: './inno-store-chip.html',
  styleUrl: './inno-store-chip.scss',
})
export class InnoStoreChip {
  name = input<string>();
  remove = output<void>();
}
