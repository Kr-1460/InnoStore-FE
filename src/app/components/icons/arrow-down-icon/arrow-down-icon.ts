import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-arrow-down-icon',
  imports: [CommonModule],
  templateUrl: './arrow-down-icon.html',
  styleUrl: './arrow-down-icon.scss',
})
export class ArrowDownIcon {
  @Input() size: number = 24;
  @Input() color: string = '#ff0000';

  @HostBinding('style.--icon-size')
  get iconSize(): string {
    return `${this.size}px`;
  }

  @HostBinding('style.--icon-color')
  get iconColor(): string {
    return this.color;
  }
}
