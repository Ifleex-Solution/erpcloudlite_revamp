import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { BranchService } from '../../../shared/services/branch.service';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-branch-form',
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
  ],
  templateUrl: './branch-form.component.html',
  styleUrl: './branch-form.component.scss'
})
export class BranchFormComponent implements OnInit, OnDestroy {
  private fb      = inject(FormBuilder);
  private service = inject(BranchService);
  private message = inject(MessageService);
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);

  private destroy$ = new Subject<void>();

  form!: FormGroup;
  saving   = false;
  loading  = false;
  isEdit   = false;
  branchId: number | null = null;

  ngOnInit(): void {
    this.buildForm();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit   = true;
      this.branchId = +id;
      this.loadBranch(this.branchId);
    } else {
      this.loadNextCode();
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      code:   ['', [Validators.required, Validators.maxLength(20)]],
      name:   ['', [Validators.required, Validators.maxLength(100)]],
      nature: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  private loadNextCode(): void {
    this.service.getNextCode().pipe(takeUntil(this.destroy$)).subscribe({
      next: res => this.form.get('code')?.setValue(res.code),
      error: () => {}
    });
  }

  private loadBranch(id: number): void {
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
        this.message.error('Failed to load branch.');
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
    const payload = { ...this.form.getRawValue() };

    const request$ = this.isEdit
      ? this.service.update(this.branchId!, payload)
      : this.service.save(payload);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        this.message.success(res.message ?? (this.isEdit ? 'Branch updated.' : 'Branch created.'));
        this.goBack();
      },
      error: (err) => {
        this.message.error(err?.error?.message ?? 'Failed to save branch.');
        this.saving = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/branch/list']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
