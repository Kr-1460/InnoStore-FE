import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InnostoreIcon } from '../innostore-icon/innostore-icon';
import { UserAvatar } from '../user-avatar/user-avatar';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, InnostoreIcon, UserAvatar],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly userPoints = signal(100);
}
