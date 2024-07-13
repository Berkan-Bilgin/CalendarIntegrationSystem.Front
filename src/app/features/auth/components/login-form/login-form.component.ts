import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form Submitted', this.loginForm.value);

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.toastr.success('Giriş Başarılı');
          console.log(response);
          this.router.navigate(['dashboard']);
        },
        error: (error) => {
          this.toastr.error('Giriş Başarısız !');
          console.error(error);
        },
      });
    } else {
      this.markAllAsTouched();
      this.toastr.warning('Form Geçerli Değil !');
    }
  }

  markAllAsTouched() {
    Object.keys(this.loginForm.controls).forEach((controlName) => {
      const control = this.loginForm.get(controlName);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }
}
