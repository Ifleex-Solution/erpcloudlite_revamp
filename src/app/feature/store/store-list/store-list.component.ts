import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
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
import { MatDividerModule } from '@angular/material/divider';

import { Store } from '../../../shared/models/store.model';
import { StoreService } from '../../../shared/services/store.service';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  templateUrl: './store-list.component.html',
  styleUrl: './store-list.component.scss'
})
export class StoreListComponent implements OnInit, OnDestroy {
  private storeService   = inject(StoreService);
  private messageService = inject(MessageService);
  private router         = inject(Router);
  private destroy$       = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  displayedColumns = ['sl', 'code', 'name', 'store_nature', 'auto_grn', 'auto_gdn', 'dstock', 'status', 'actions'];
  dataSource = new MatTableDataSource<Store>([]);

  loading      = false;
  totalRecords = 0;
  pageIndex    = 0;
  pageSize     = 10;
  searchText   = '';

  private auth = inject(AuthService);
  readonly subId = 3;
  get canCreate() { return this.auth.canAccess(this.subId, 'create'); }
  get canUpdate() { return this.auth.canAccess(this.subId, 'update'); }
  get canDelete() { return this.auth.canAccess(this.subId, 'delete'); }

  
ngOnInit(): void {
    this.searchSubject$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.pageIndex = 0;
      this.loadStores();
    });
    this.loadStores();
  }

  loadStores(): void {
    this.loading = true;
    this.storeService
      .getList(this.pageIndex + 1, this.pageSize, this.searchText)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.dataSource.data = res.data;
          this.totalRecords    = res.total;
          this.loading         = false;
        },
        error: () => {
          this.messageService.error('Failed to load stores.');
          this.loading = false;
        }
      });
  }

  onSearch(value: string): void { this.searchSubject$.next(value); }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize  = event.pageSize;
    this.loadStores();
  }

  addStore(): void  { this.router.navigate(['/store/add']); }
  editStore(store: Store): void { this.router.navigate(['/store/edit', store.id]); }

  deleteStore(store: Store): void {
    if (!confirm(`Delete store "${store.name}"? This cannot be undone.`)) return;
    this.storeService.delete(store.id!).pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        this.messageService.success(res.message ?? 'Store deleted.');
        this.loadStores();
      },
      error: () => this.messageService.error('Failed to delete store.')
    });
  }

  grnLabel(val: number | ''): string   { return val === 1 ? 'Enabled'      : val === 0 ? 'Disabled' : '-'; }
  gdnLabel(val: number | ''): string   { return val === 1 ? 'Enabled'      : val === 0 ? 'Disabled' : '-'; }
  stockLabel(val: number | ''): string { return val === 1 ? 'Master Stock' : val === 0 ? 'Substock' : '-'; }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}


