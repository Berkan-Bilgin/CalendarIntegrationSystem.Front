import { LoginPageComponent } from './login-page/login-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
    title: 'Login',
    // canMatch: [hasNoRole],
  },
  {
    path: 'signup',
    component: SignupPageComponent,
    title: 'Sign Up',
    // canMatch: [hasNoRole],
  },
];
