import { DashboardComponent } from './dashboard/dashboard.component';
import { MyCalendarComponent } from './my-calendar/my-calendar.component';
import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard',
    // canMatch: [hasNoRole],
  },
  {
    path: 'calendar',
    component: MyCalendarComponent,
    title: 'Calendar',
    // canMatch: [hasNoRole],
  },
];
