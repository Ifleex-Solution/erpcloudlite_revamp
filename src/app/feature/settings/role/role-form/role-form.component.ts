import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, forkJoin } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Module, RoleService } from '../../../../shared/services/role.service';
import { MessageService } from '../../../../core/services/message.service';

type PermAction = 'create' | 'read' | 'update' | 'delete';
interface Perm { create: boolean; read: boolean; update: boolean; delete: boolean; }

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatCheckboxModule, MatProgressSpinnerModule,
  ],
  templateUrl: './role-form.component.html',
  styleUrl:    './role-form.component.scss',
})
export class RoleFormComponent implements OnInit, OnDestroy {
  private roleService = inject(RoleService);
  private message     = inject(MessageService);
  private fb          = inject(FormBuilder);
  private router      = inject(Router);
  private route       = inject(ActivatedRoute);
  private destroy$    = new Subject<void>();

  form!:   FormGroup;
  modules: Module[] = [];
  loading = false;
  saving  = false;
  isEdit  = false;
  roleId: number | null = null;

  readonly actions: PermAction[] = ['create', 'read', 'update', 'delete'];
  permissions: Record<number, Perm> = {};

  ngOnInit(): void {
    this.form = this.fb.group({ role_name: ['', Validators.required] });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.roleId = +id;
      this.loadForEdit(+id);
    } else {
      this.loadModules();
    }
  }

  private initPermissions(modules: Module[]): void {
    for (const mod of modules) {
      for (const sub of mod.sub_modules) {
        this.permissions[sub.id] = { create: false, read: false, update: false, delete: false };
      }
    }
  }

  private loadModules(): void {
    this.loading = true;
    this.roleService.modules().pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        this.modules = res.data;
        this.initPermissions(res.data);
        this.loading = false;
      },
      error: () => { this.message.error('Failed to load modules.'); this.loading = false; },
    });
  }

  private loadForEdit(id: number): void {
    this.loading = true;
    forkJoin({
      modules: this.roleService.modules(),
      role:    this.roleService.getById(id),
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: ({ modules, role }) => {
        this.modules = modules.data;
        this.initPermissions(modules.data);
        this.form.patchValue({ role_name: role.data.role_name });
        for (const p of role.data.permissions) {
          if (this.permissions[p.submodule_id]) {
            this.permissions[p.submodule_id] = {
              create: !!p.create,
              read:   !!p.read,
              update: !!p.update,
              delete: !!p.delete,
            };
          }
        }
        this.loading = false;
      },
      error: () => {
        this.message.error('Failed to load role.');
        this.loading = false;
        this.goBack();
      },
    });
  }

  label(name: string): string {
    return name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  checkAll(mod: Module, action: PermAction, checked: boolean): void {
    mod.sub_modules.forEach(sm => { this.permissions[sm.id][action] = checked; });
  }

  isAllChecked(mod: Module, action: PermAction): boolean {
    return mod.sub_modules.length > 0 &&
      mod.sub_modules.every(sm => this.permissions[sm.id]?.[action]);
  }

  isSomeChecked(mod: Module, action: PermAction): boolean {
    const count = mod.sub_modules.filter(sm => this.permissions[sm.id]?.[action]).length;
    return count > 0 && count < mod.sub_modules.length;
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;

    const permArray = this.modules.flatMap(mod =>
      mod.sub_modules.map(sub => ({
        module_id:    mod.id,
        submodule_id: sub.id,
        create:       this.permissions[sub.id].create ? 1 : 0,
        read:         this.permissions[sub.id].read   ? 1 : 0,
        update:       this.permissions[sub.id].update ? 1 : 0,
        delete:       this.permissions[sub.id].delete ? 1 : 0,
      }))
    );

    const payload = { role_name: this.form.value.role_name, permissions: permArray };

    const req$ = this.isEdit
      ? this.roleService.update(this.roleId!, payload)
      : this.roleService.save(payload);

    req$.pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        this.message.success(res.message ?? (this.isEdit ? 'Role updated.' : 'Role saved.'));
        this.goBack();
      },
      error: err => {
        this.message.error(err?.error?.message ?? 'Failed to save role.');
        this.saving = false;
      },
    });
  }

  goBack(): void { this.router.navigate(['/settings/role/list']); }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
