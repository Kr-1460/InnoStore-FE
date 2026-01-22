import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chevron-right-icon',
  imports: [CommonModule],
  templateUrl: './chevron-right-icon.html',
  styleUrl: './chevron-right-icon.scss',
})
export class ChevronRightIcon {
  @Input() size: number = 24;
  @Input() color: string = '#353535';

  @HostBinding('style.--icon-size')
  get iconSize(): string {
    return `${this.size}px`;
  }

  @HostBinding('style.--icon-color')
  get iconColor(): string {
    return this.color;
  }
}
