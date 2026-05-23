import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatIconModule,
    MatButtonModule, MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form: FormGroup;
  loading      = false;
  error        = '';
  hidePassword = true;

  private readonly screenRoutes: Record<number, string> = {
    1: '/branch/list',
    2: '/branch/list',
    3: '/product/product-info/list',
    6: '/service/list',
    7: '/branch/list',
    8: '/branch/list',
    9: '/branch/list',
    10: '/branch/list',
  };

  constructor(
    private fb:     FormBuilder,
    private auth:   AuthService,
    private theme:  ThemeService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error   = '';
    const { username, password } = this.form.value;

    this.auth.login(username, password).subscribe({
      next: res => {
        // Apply company theme from session
        const company = res.company;
        if (company.theme_color) this.theme.setTheme(company.theme_color);
        this.theme.setDark(!!company.theme_dark);

        this.loading = false;
        const route = this.screenRoutes[res.user.screen] ?? '/branch/list';
        this.router.navigate([route]);
      },
      error: err => {
        this.loading = false;
        this.error   = err.error?.message ?? 'Login failed. Please try again.';
      },
    });
  }
}
