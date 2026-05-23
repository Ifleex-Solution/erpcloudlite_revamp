import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { User, UserService } from '../../../../shared/services/user.service';
import { MessageService } from '../../../../core/services/message.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatPaginatorModule, MatCardModule,
    MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatTooltipModule, MatProgressSpinnerModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl:    './user-list.component.scss',
})
export class UserListComponent implements OnInit, OnDestroy {
  private service  = inject(UserService);
  private message  = inject(MessageService);
  private router   = inject(Router);
  private destroy$ = new Subject<void>();
  private search$  = new Subject<string>();

  displayedColumns = ['sl', 'fullname', 'username', 'company_name', 'screen', 'temporary', 'status', 'actions'];
  dataSource = new MatTableDataSource<User>([]);

  loading      = false;
  totalRecords = 0;
  pageIndex    = 0;
  pageSize     = 10;
  searchText   = '';

  ngOnInit(): void {
    this.search$.pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => { this.pageIndex = 0; this.load(); });
    this.load();
  }

  load(): void {
    this.loading = true;
    this.service.list(this.pageIndex + 1, this.pageSize, this.searchText)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.dataSource.data = res.data;
          this.totalRecords    = res.total;
          this.loading         = false;
        },
        error: () => { this.message.error('Failed to load users.'); this.loading = false; },
      });
  }

  onSearch(v: string): void { this.search$.next(v); }

  onPageChange(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize  = e.pageSize;
    this.load();
  }

  add():          void { this.router.navigate(['/settings/user/add']); }
  edit(row: User): void { this.router.navigate(['/settings/user/edit', row.user_id]); }

  delete(row: User): void {
    if (!confirm(`Delete user "${row.fullname ?? row.username}"? This cannot be undone.`)) return;
    this.service.delete(row.user_id!).pipe(takeUntil(this.destroy$)).subscribe({
      next: res => { this.message.success(res.message ?? 'Deleted.'); this.load(); },
      error: err => this.message.error(err?.error?.message ?? 'Failed to delete user.'),
    });
  }

  screenLabel(v: number | string): string {
    const map: Record<number, string> = {
      1: 'Dashboard', 2: 'Sale Invoice', 3: 'Products',
      6: 'Service Invoice', 7: 'Purchase Invoice',
      8: 'GRN', 9: 'GDN', 10: 'Human Resource',
    };
    return map[+v] ?? '-';
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
