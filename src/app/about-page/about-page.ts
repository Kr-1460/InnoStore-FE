import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ROUTE_LINKS } from '../configs/app-routes.config';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
})
export class AboutComponent {

  teamPlaceholders = new Array(10);
  constructor(private router: Router) {}

  goToCatalog() {
    this.router.navigate([ROUTE_LINKS.PRODUCTS]);
  }
}