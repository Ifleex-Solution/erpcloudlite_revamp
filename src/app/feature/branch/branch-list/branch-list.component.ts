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

import { Branch } from '../../../shared/models/branch.model';
import { BranchService } from '../../../shared/services/branch.service';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-branch-list',
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
  ],
  templateUrl: './branch-list.component.html',
  styleUrl: './branch-list.component.scss'
})
export class BranchListComponent implements OnInit, OnDestroy {
  private branchService  = inject(BranchService);
  private messageService = inject(MessageService);
  private router         = inject(Router);
  private destroy$       = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  displayedColumns = ['sl', 'code', 'name', 'nature', 'status', 'actions'];
  dataSource = new MatTableDataSource<Branch>([]);

  loading      = false;
  totalRecords = 0;
  pageIndex    = 0;
  pageSize     = 10;
  searchText   = '';

  private auth = inject(AuthService);
  readonly subId = 2;
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
      this.loadBranches();
    });
    this.loadBranches();
  }

  loadBranches(): void {
    this.loading = true;
    this.branchService
      .getList(this.pageIndex + 1, this.pageSize, this.searchText)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          this.dataSource.data = res.data;
          this.totalRecords    = res.total;
          this.loading         = false;
        },
        error: () => {
          this.messageService.error('Failed to load branches.');
          this.loading = false;
        }
      });
  }

  onSearch(value: string): void { this.searchSubject$.next(value); }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize  = event.pageSize;
    this.loadBranches();
  }

  addBranch(): void  { this.router.navigate(['/branch/add']); }
  editBranch(branch: Branch): void { this.router.navigate(['/branch/edit', branch.id]); }

  deleteBranch(branch: Branch): void {
    if (!confirm(`Delete branch "${branch.name}"? This cannot be undone.`)) return;
    this.branchService.delete(branch.id!).pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        this.messageService.success(res.message ?? 'Branch deleted.');
        this.loadBranches();
      },
      error: () => this.messageService.error('Failed to delete branch.')
    });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}


