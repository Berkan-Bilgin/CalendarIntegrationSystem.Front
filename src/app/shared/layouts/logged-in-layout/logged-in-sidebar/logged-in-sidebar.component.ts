import { Component } from '@angular/core';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-logged-in-sidebar',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './logged-in-sidebar.component.html',
  styleUrl: './logged-in-sidebar.component.scss',
})
export class LoggedInSidebarComponent {
  adminMenuItems = [
    { label: 'Dashboard', link: 'dashboard', icon: 'dashboard' },
    { label: 'Events', link: 'events', icon: 'medical_services' },
    { label: 'Tasks', link: 'tasks', icon: 'people' },
    { label: 'Calendar', link: 'calendar', icon: 'event' },
  ];
}
