import { Component } from '@angular/core';
import { LoggedInHeaderComponent } from './logged-in-header/logged-in-header.component';
import { LoggedInSidebarComponent } from './logged-in-sidebar/logged-in-sidebar.component';

@Component({
  selector: 'app-logged-in-layout',
  standalone: true,
  imports: [LoggedInHeaderComponent, LoggedInSidebarComponent],
  templateUrl: './logged-in-layout.component.html',
  styleUrl: './logged-in-layout.component.scss',
})
export class LoggedInLayoutComponent {}
