import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, forkJoin } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

import { User, UserService } from '../../../../shared/services/user.service';
import { SettingsService } from '../../../../shared/services/settings.service';
import { MessageService } from '../../../../core/services/message.service';

interface CompanyOption { company_id: number; company_name: string; }

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatProgressSpinnerModule, MatIconModule, MatCardModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl:    './user-form.component.scss',
})
export class UserFormComponent implements OnInit, OnDestroy {
  private fb       = inject(FormBuilder);
  private service  = inject(UserService);
  private settings = inject(SettingsService);
  private message  = inject(MessageService);
  private router   = inject(Router);
  private route    = inject(ActivatedRoute);

  private destroy$ = new Subject<void>();

  form!:  FormGroup;
  isEdit  = false;
  userId: string | null = null;
  loading = false;
  saving  = false;
  hidePass = true;

  companies: CompanyOption[] = [];

  readonly screens = [
    { value: 1,  label: 'Dashboard' },
    { value: 2,  label: 'Sale Invoice' },
    { value: 6,  label: 'Service Invoice' },
    { value: 7,  label: 'Purchase Invoice' },
    { value: 8,  label: 'GRN' },
    { value: 9,  label: 'GDN' },
    { value: 10, label: 'Human Resource' },
    { value: 3,  label: 'Products' },
  ];

  ngOnInit(): void {
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name:  [''],
      username:   ['', Validators.required],
      password:   ['', Validators.required],   // required on add; cleared for edit
      user_type:  ['', Validators.required],
      screen:     [1,  Validators.required],
      temporary:  [0,  Validators.required],
      startdate:  [''],
      enddate:    [''],
      status:     [1,  Validators.required],
    });

    // show/hide date validators when temporary changes
    this.form.get('temporary')!.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => this.setDateValidators(+val));

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.userId = id;
      // password not required on edit (blank = keep existing)
      this.form.get('password')!.clearValidators();
      this.form.get('password')!.updateValueAndValidity();
      this.loadData(id);
    } else {
      this.loadCompanies(null);
    }
  }

  private setDateValidators(temporary: number): void {
    const start = this.form.get('startdate')!;
    const end   = this.form.get('enddate')!;
    if (temporary === 1) {
      start.setValidators(Validators.required);
      end.setValidators(Validators.required);
    } else {
      start.clearValidators();
      end.clearValidators();
      start.setValue('');
      end.setValue('');
    }
    start.updateValueAndValidity();
    end.updateValueAndValidity();
  }

  private normalizeCompanies(raw: { company_id: number | string; company_name: string }[]): CompanyOption[] {
    return raw.map(c => ({ company_id: +c.company_id, company_name: c.company_name }));
  }

  private loadCompanies(userId: string | null): void {
    this.settings.allCompanies(userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: res => { this.companies = this.normalizeCompanies(res.data); },
      error: () => this.message.error('Failed to load companies.'),
    });
  }

  private loadData(id: string): void {
    this.loading = true;
    forkJoin({
      user:      this.service.getById(id),
      companies: this.settings.allCompanies(id),   // filter companies by this user_id
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: ({ user, companies }) => {
        this.companies = this.normalizeCompanies(companies.data);
        const d = user.data;
        this.form.patchValue({
          first_name: d.first_name,
          last_name:  d.last_name,
          username:   d.username,
          user_type:  +d.user_type,
          screen:     +d.screen,
          temporary:  +d.temporary,
          startdate:  d.startdate,
          enddate:    d.enddate,
          status:     +d.status,
        });
        this.loading = false;
      },
      error: () => {
        this.message.error('Failed to load user.');
        this.loading = false;
        this.goBack();
      },
    });
  }

  get f(): { [key: string]: AbstractControl } { return this.form.controls; }

  isTemporary(): boolean { return +this.f['temporary'].value === 1; }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;

    const payload: User = { ...this.form.getRawValue() };

    const req$ = this.isEdit
      ? this.service.update(this.userId!, payload)
      : this.service.save(payload);

    req$.pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        this.message.success(res.message ?? (this.isEdit ? 'User updated.' : 'User saved.'));
        this.goBack();
      },
      error: () => { this.message.error('Failed to save user.'); this.saving = false; },
    });
  }

  goBack(): void { this.router.navigate(['/settings/user/list']); }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
