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

import { Company, SettingsService } from '../../../../shared/services/settings.service';
import { MessageService } from '../../../../core/services/message.service';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatPaginatorModule, MatCardModule,
    MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatTooltipModule, MatProgressSpinnerModule,
  ],
  templateUrl: './company-list.component.html',
  styleUrl:    './company-list.component.scss',
})
export class CompanyListComponent implements OnInit, OnDestroy {
  private service  = inject(SettingsService);
  private message  = inject(MessageService);
  private router   = inject(Router);
  private destroy$ = new Subject<void>();
  private search$  = new Subject<string>();

  displayedColumns = ['sl', 'company_name', 'mobile', 'address', 'website', 'instance_type', 'status', 'actions'];
  dataSource = new MatTableDataSource<Company>([]);

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
        error: () => { this.message.error('Failed to load companies.'); this.loading = false; },
      });
  }

  onSearch(v: string): void { this.search$.next(v); }

  onPageChange(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize  = e.pageSize;
    this.load();
  }

  add():              void { this.router.navigate(['/settings/company/add']); }
  edit(row: Company): void { this.router.navigate(['/settings/company/edit', +row.company_id!]); }

  delete(row: Company): void {
    if (!confirm(`Delete company "${row.company_name}"? This cannot be undone.`)) return;
    this.service.delete(+row.company_id!).pipe(takeUntil(this.destroy$)).subscribe({
      next: res => { this.message.success(res.message ?? 'Deleted.'); this.load(); },
      error: err => this.message.error(err?.error?.message ?? 'Failed to delete company.'),
    });
  }

  instanceClass(type: string): string {
    const map: Record<string, string> = {
      DEV: 'chip-dev', UAT: 'chip-uat', BETA: 'chip-beta',
      PROD: 'chip-prod', LIVE: 'chip-live',
    };
    return map[type] ?? '';
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
