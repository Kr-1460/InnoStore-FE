import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-arrow-up-icon',
  imports: [CommonModule],
  templateUrl: './arrow-up-icon.html',
  styleUrl: './arrow-up-icon.scss',
})
export class ArrowUpIcon {
  @Input() size: number = 24;
  @Input() color: string = '#00aa00';

  @HostBinding('style.--icon-size')
  get iconSize(): string {
    return `${this.size}px`;
  }

  @HostBinding('style.--icon-color')
  get iconColor(): string {
    return this.color;
  }
}
