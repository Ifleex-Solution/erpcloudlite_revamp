import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { RoleListItem, RoleService } from '../../../../shared/services/role.service';
import { MessageService } from '../../../../core/services/message.service';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule, MatCardModule, MatButtonModule,
    MatIconModule, MatTooltipModule, MatProgressSpinnerModule,
  ],
  templateUrl: './role-list.component.html',
  styleUrl:    './role-list.component.scss',
})
export class RoleListComponent implements OnInit, OnDestroy {
  private service  = inject(RoleService);
  private message  = inject(MessageService);
  private router   = inject(Router);
  private destroy$ = new Subject<void>();

  displayedColumns = ['sl', 'type', 'permission_count', 'actions'];
  dataSource = new MatTableDataSource<RoleListItem>([]);
  loading = false;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.service.list().pipe(takeUntil(this.destroy$)).subscribe({
      next: res => { this.dataSource.data = res.data; this.loading = false; },
      error: () => { this.message.error('Failed to load roles.'); this.loading = false; },
    });
  }

  add():  void { this.router.navigate(['/settings/role/add']); }
  edit(row: RoleListItem): void { this.router.navigate(['/settings/role/edit', row.id]); }

  delete(row: RoleListItem): void {
    if (!confirm(`Delete role "${row.type}"? This cannot be undone.`)) return;
    this.service.delete(row.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: res => { this.message.success(res.message ?? 'Deleted.'); this.load(); },
      error: err => this.message.error(err?.error?.message ?? 'Failed to delete role.'),
    });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
