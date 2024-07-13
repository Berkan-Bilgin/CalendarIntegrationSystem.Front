import { Component } from '@angular/core';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { LocalStorageService } from '../../../../core/browser/services/local-storage.service';

@Component({
  selector: 'app-logged-in-header',
  standalone: true,
  imports: [],
  templateUrl: './logged-in-header.component.html',
  styleUrl: './logged-in-header.component.scss',
})
export class LoggedInHeaderComponent {
  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
  ) {}

  email: string | null = null;

  ngOnInit(): void {
    this.email = this.localStorageService.get('email');
  }

  logout() {
    this.authService.logout();
  }
}
