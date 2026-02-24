import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-inno-store-switcher',
  imports: [],
  templateUrl: './inno-store-switcher.html',
  styleUrl: './inno-store-switcher.scss',
})
export class InnoStoreSwitcher {
  options = input.required<string[]>();
  active = input.required<string>();

  errorOptions = input<string[]>([]);

  select = output<string>();
}
