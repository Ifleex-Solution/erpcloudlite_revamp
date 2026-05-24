import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgClass } from '@angular/common';

import { Company, SettingsService } from '../../../../shared/services/settings.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { MessageService } from '../../../../core/services/message.service';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, NgClass,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatProgressSpinnerModule, MatIconModule,
    MatCardModule, MatDividerModule, MatSlideToggleModule,
  ],
  templateUrl: './company-form.component.html',
  styleUrl:    './company-form.component.scss',
})
export class CompanyFormComponent implements OnInit, OnDestroy {
  private fb       = inject(FormBuilder);
  private service  = inject(SettingsService);
  private message  = inject(MessageService);
  private router   = inject(Router);
  private route    = inject(ActivatedRoute);
  themeService     = inject(ThemeService);

  private destroy$ = new Subject<void>();

  form!: FormGroup;
  isEdit     = false;
  companyId: number | null = null;
  loading    = false;
  saving     = false;
  hidePass   = true;

  selectedTheme = 'theme-azure';
  darkMode      = false;

  ngOnInit(): void {
    this.form = this.fb.group({
      company_name:    ['', Validators.required],
      mobile:          ['', Validators.required],
      address:         [''],
      email:           [''],
      website:         [''],
      vat_no:          [''],
      cr_no:           [''],
      footer_text:     [''],
      password:        [''],
      instance_type:   [''],
      password_enable: [0, Validators.required],
      status:          [1, Validators.required],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit    = true;
      this.companyId = +id;
      this.loadCompany(this.companyId);
    }
  }

  private loadCompany(id: number): void {
    this.loading = true;
    this.service.getById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        const d = res.data;
        this.form.patchValue({
          ...d,
          password_enable: +d.password_enable,
          status:          +d.status,
        });
        this.selectedTheme = d.theme_color ?? 'theme-azure';
        this.darkMode      = !!+d.theme_dark!;
        this.loading = false;
      },
      error: () => {
        this.message.error('Failed to load company.');
        this.loading = false;
        this.goBack();
      },
    });
  }

  get f(): { [key: string]: AbstractControl } { return this.form.controls; }

  selectTheme(id: string): void { this.selectedTheme = id; }
  toggleDark():              void { this.darkMode = !this.darkMode; }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;

    const payload: Company = {
      ...this.form.getRawValue(),
      theme_color: this.selectedTheme,
      theme_dark:  this.darkMode ? 1 : 0,
    };

    const req$ = this.isEdit
      ? this.service.update(this.companyId!, payload)
      : this.service.save(payload);

    req$.pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        // Update sessionStorage company so theme persists on reload
        try {
          const stored = JSON.parse(sessionStorage.getItem('company') ?? '{}');
          stored.theme_color = this.selectedTheme;
          stored.theme_dark  = this.darkMode ? 1 : 0;
          sessionStorage.setItem('company', JSON.stringify(stored));
        } catch {}
        this.themeService.setTheme(this.selectedTheme);
        this.themeService.setDark(this.darkMode);
        this.message.success(res.message ?? (this.isEdit ? 'Company updated.' : 'Company saved.'));
        this.goBack();
      },
      error: () => {
        this.message.error('Failed to save company.');
        this.saving = false;
      },
    });
  }

  goBack(): void { this.router.navigate(['/settings/company/list']); }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
