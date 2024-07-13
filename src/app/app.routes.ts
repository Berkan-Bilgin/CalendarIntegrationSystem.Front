import { Routes } from '@angular/router';
import { authRoutes } from './pages/_auth/auth.routes';
import { adminRoutes } from './pages/_admin/admin.routes';

export const routes: Routes = [...authRoutes, ...adminRoutes];
