import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

export interface SystemColor {
  id: string;
  name: string;
  hex: string;
}

@Component({
  selector: 'app-inno-store-color-selection',
  imports: [CommonModule],
  templateUrl: './inno-store-color-selection.html',
  styleUrl: './inno-store-color-selection.scss',
})
export class InnoStoreColorSelection {
  availableColors = input<SystemColor[]>([
    { id: '1', name: 'Black', hex: '#000000' },
    { id: '2', name: 'White', hex: '#FFFFFF' },
    { id: '3', name: 'Grey', hex: '#808080' },
  ]);

  selectedColorId = input<string>();
  colorChange = output<SystemColor>();

  selectColor(color: SystemColor) {
    this.colorChange.emit(color);
  }
}
