import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard',
    // canMatch: [hasNoRole],
  },
];
