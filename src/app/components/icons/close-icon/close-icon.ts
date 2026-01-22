import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-close-icon',
  imports: [CommonModule],
  templateUrl: './close-icon.html',
  styleUrl: './close-icon.scss',
})
export class CloseIcon {
  @Input() size: number = 24;
  @Input() color: string = '#000000';

  @HostBinding('style.--icon-size')
  get iconSize(): string {
    return `${this.size}px`;
  }

  @HostBinding('style.--icon-color')
  get iconColor(): string {
    return this.color;
  }
}
