import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, forkJoin } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UserOption, UserRoleService } from '../../../../shared/services/userrole.service';
import { MessageService } from '../../../../core/services/message.service';

@Component({
  selector: 'app-userrole-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatSelectModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
  ],
  templateUrl: './userrole-form.component.html',
  styleUrl:    './userrole-form.component.scss',
})
export class UserroleFormComponent implements OnInit, OnDestroy {
  private service  = inject(UserRoleService);
  private message  = inject(MessageService);
  private fb       = inject(FormBuilder);
  private router   = inject(Router);
  private route    = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  form!:  FormGroup;
  isEdit  = false;
  entryId: number | null = null;
  loading = false;
  saving  = false;

  users: UserOption[] = [];
  roles: string[]     = [];

  // For edit: show readonly info
  editUser     = '';
  editRole     = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit  = true;
      this.entryId = +id;
      this.form = this.fb.group({ status: [1, Validators.required] });
      this.loadForEdit(+id);
    } else {
      this.form = this.fb.group({
        user_id:   ['', Validators.required],
        role_type: ['', Validators.required],
        status:    [1,  Validators.required],
      });
      this.loadDropdowns();
    }
  }

  private loadDropdowns(): void {
    this.loading = true;
    this.service.dropdowns().pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        this.users = res.data.users;
        this.roles = res.data.roles;
        this.loading = false;
      },
      error: () => { this.message.error('Failed to load options.'); this.loading = false; },
    });
  }

  private loadForEdit(id: number): void {
    this.loading = true;
    this.service.getById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        const d = res.data;
        this.editUser = `${d.fullname} (${d.username})`;
        this.editRole = d.role_type;
        this.form.patchValue({ status: +d.status });
        this.loading = false;
      },
      error: () => {
        this.message.error('Failed to load assignment.');
        this.loading = false;
        this.goBack();
      },
    });
  }

  get f() { return this.form.controls; }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;

    const req$ = this.isEdit
      ? this.service.update(this.entryId!, { status: +this.form.value.status })
      : this.service.save(this.form.getRawValue());

    req$.pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        this.message.success(res.message ?? (this.isEdit ? 'Updated.' : 'Role assigned.'));
        this.goBack();
      },
      error: err => {
        this.message.error(err?.error?.message ?? 'Failed to save.');
        this.saving = false;
      },
    });
  }

  goBack(): void { this.router.navigate(['/settings/userrole/list']); }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
