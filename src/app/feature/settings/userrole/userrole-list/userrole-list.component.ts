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

import { UserRoleItem, UserRoleService } from '../../../../shared/services/userrole.service';
import { MessageService } from '../../../../core/services/message.service';

@Component({
  selector: 'app-userrole-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule, MatCardModule, MatButtonModule,
    MatIconModule, MatTooltipModule, MatProgressSpinnerModule,
  ],
  templateUrl: './userrole-list.component.html',
  styleUrl:    './userrole-list.component.scss',
})
export class UserroleListComponent implements OnInit, OnDestroy {
  private service  = inject(UserRoleService);
  private message  = inject(MessageService);
  private router   = inject(Router);
  private destroy$ = new Subject<void>();

  displayedColumns = ['sl', 'user', 'role_type', 'status', 'actions'];
  dataSource = new MatTableDataSource<UserRoleItem>([]);
  loading = false;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.service.list().pipe(takeUntil(this.destroy$)).subscribe({
      next: res => { this.dataSource.data = res.data; this.loading = false; },
      error: () => { this.message.error('Failed to load assignments.'); this.loading = false; },
    });
  }

  add():  void { this.router.navigate(['/settings/userrole/add']); }
  edit(row: UserRoleItem): void { this.router.navigate(['/settings/userrole/edit', row.id]); }

  delete(row: UserRoleItem): void {
    if (!confirm(`Remove role "${row.role_type}" from "${row.fullname}"?`)) return;
    this.service.delete(row.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: res => { this.message.success(res.message ?? 'Removed.'); this.load(); },
      error: err => this.message.error(err?.error?.message ?? 'Failed to remove assignment.'),
    });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
