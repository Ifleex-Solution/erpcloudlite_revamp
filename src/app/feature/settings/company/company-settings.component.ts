import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgClass } from '@angular/common';
import { SettingsService, CompanyInfo } from '../../../shared/services/settings.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-company-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDividerModule,
    MatTooltipModule,
    NgClass,
  ],
  templateUrl: './company-settings.component.html',
  styleUrl: './company-settings.component.scss',
})
export class CompanySettingsComponent implements OnInit {
  private fb       = inject(FormBuilder);
  private settings = inject(SettingsService);
  private snack    = inject(MatSnackBar);
  themeService     = inject(ThemeService);

  form!: FormGroup;
  loading  = true;
  saving   = false;
  hidePass = true;
  editMode = false;

  selectedTheme = 'theme-azure';
  darkMode      = false;

  ngOnInit(): void {
    this.form = this.fb.group({
      company_name:    [''],
      mobile:          [''],
      address:         [''],
      email:           [''],
      website:         [''],
      vat_no:          [''],
      cr_no:           [''],
      footer_text:     [''],
      instance_type:   [''],
      password_enable: [0],
      password:        [''],
      status:          [1],
    });

    this.loadCompany();
  }

  loadCompany(): void {
    this.loading = true;
    this.settings.getCompany().subscribe({
      next: res => {
        const d = res.data;
        this.form.patchValue(d);
        this.selectedTheme = d.theme_color ?? 'theme-azure';
        this.darkMode      = !!d.theme_dark;
        this.loading = false;
      },
      error: () => {
        this.snack.open('Failed to load company data', 'Close', { duration: 3000 });
        this.loading = false;
      },
    });
  }

  enableEdit(): void {
    this.editMode = true;
    this.form.enable();
  }

  cancelEdit(): void {
    this.editMode = false;
    this.form.disable();
    this.loadCompany();
  }

  selectTheme(id: string): void {
    this.selectedTheme = id;
  }

  toggleDark(): void {
    this.darkMode = !this.darkMode;
  }

  save(): void {
    if (this.saving) return;
    this.saving = true;

    const payload: CompanyInfo = {
      ...this.form.value,
      theme_color: this.selectedTheme,
      theme_dark:  this.darkMode ? 1 : 0,
    };

    this.settings.updateCompany(payload).subscribe({
      next: () => {
        this.themeService.setTheme(this.selectedTheme);
        this.themeService.isDark.set(this.darkMode);
        const html = document.documentElement;
        html.classList.toggle('dark-mode', this.darkMode);
        localStorage.setItem('app-dark', String(this.darkMode));

        this.snack.open('Company settings saved successfully', 'Close', { duration: 2500 });
        this.saving   = false;
        this.editMode = false;
        this.form.disable();
      },
      error: () => {
        this.snack.open('Failed to save settings', 'Close', { duration: 3000 });
        this.saving = false;
      },
    });
  }
}
