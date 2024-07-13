import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BasicLayoutComponent } from './shared/layouts/basic-layout/basic-layout.component';
import { LoggedInLayoutComponent } from './shared/layouts/logged-in-layout/logged-in-layout.component';
import { AuthService } from './features/auth/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BasicLayoutComponent,
    LoggedInLayoutComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'CalendarIntegrationSystem.Front';

  isLoggedIn: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }
}
