import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inno-store-input',
  imports: [FormsModule],
  templateUrl: './inno-store-input.html',
  styleUrl: './inno-store-input.scss',
})
export class InnoStoreInput {
  label = input.required<string>();
  value = input<string | number>('');
  type = input<'text' | 'number'>('text');
  placeholder = input<string>('');
  class = input<string>('');
  isMultiline = input<boolean>(false);
  valueChange = output<any>();
}
