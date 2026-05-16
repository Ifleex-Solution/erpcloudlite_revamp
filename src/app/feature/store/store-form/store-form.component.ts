import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { Store } from '../../../shared/models/store.model';
import { StoreService } from '../../../shared/services/store.service';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './store-form.component.html',
  styleUrl: './store-form.component.scss'
})
export class StoreFormComponent implements OnInit, OnDestroy {
  private fb      = inject(FormBuilder);
  private service = inject(StoreService);
  private message = inject(MessageService);
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);

  private destroy$ = new Subject<void>();

  form!: FormGroup;
  saving  = false;
  loading = false;
  isEdit  = false;
  storeId: number | null = null;

  ngOnInit(): void {
    this.buildForm();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit  = true;
      this.storeId = +id;
      this.loadStore(this.storeId);
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      code:         ['', [Validators.required, Validators.maxLength(20)]],
      name:         ['', [Validators.required, Validators.maxLength(100)]],
      store_nature: ['', Validators.required],
      auto_grn:     ['', Validators.required],
      auto_gdn:     ['', Validators.required],
      dstock:       ['', Validators.required],
      status:       ['', Validators.required],
    });
  }

  private loadStore(id: number): void {
    this.loading = true;
    this.service.getById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        if (res.data) {
          this.form.patchValue(res.data);
          this.form.get('code')?.disable();
        }
        this.loading = false;
      },
      error: () => {
        this.message.error('Failed to load store.');
        this.loading = false;
        this.goBack();
      }
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const payload: Store = { ...this.form.getRawValue() };

    const request$ = this.isEdit
      ? this.service.update(this.storeId!, payload)
      : this.service.save(payload);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        this.message.success(res.message ?? (this.isEdit ? 'Store updated.' : 'Store created.'));
        this.goBack();
      },
      error: () => {
        this.message.error('Failed to save store.');
        this.saving = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/store/list']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
