import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { tap } from 'rxjs';
import { UserService } from './services/auth/user.service';
import { jwtDecode } from "jwt-decode";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  public isAuthenticated = false;
  public isSidebarExpanded = true;

  protected readonly title = signal('InnoStore-FE');

  constructor(private authService: AuthService, private userService: UserService) { }
  ngOnInit(): void {
    this.authService.isAuthenticated$
      .pipe(
        tap((result) => {
          this.isAuthenticated = result;
          this.authService.getAccessTokenSilently().subscribe(token => {
            if (token) {
              const decodedToken: any = jwtDecode(token);
              if (decodedToken.permissions) {
                this.userService.emitPermissionsChanged(decodedToken.permissions);
              }
              this.userService.setCurrentUserEmail(decodedToken.email);
            }
          });
        })
      )
      .subscribe();
  }

  public sidebarExpandedChanged(isExpanded: boolean) {
    this.isSidebarExpanded = isExpanded;
  }
}
