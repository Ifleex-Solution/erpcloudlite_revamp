import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { StockAdjustmentService } from '../../../../shared/services/stock-adjustment.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-stock-adjustment-list',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule, MatIconModule, MatButtonModule, MatTableModule,
    MatPaginatorModule, MatFormFieldModule, MatInputModule,
    MatProgressSpinnerModule, MatDatepickerModule, MatNativeDateModule,
  ],
  templateUrl: './stock-adjustment-list.component.html',
  styleUrl: './stock-adjustment-list.component.scss',
})
export class StockAdjustmentListComponent implements OnInit {
  displayedColumns = ['sl', 'id', 'date', 'stock_type', 'incident_type', 'actions'];
  data: any[] = [];
  total = 0;
  page = 1;
  pageSize = 10;
  search = '';
  fdate = '';
  tdate = '';
  loading = false;

  private svc  = inject(StockAdjustmentService);
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly subId = 17;
  get canCreate() { return this.auth.canAccess(this.subId, 'create'); }
  get canUpdate() { return this.auth.canAccess(this.subId, 'update'); }
  get canDelete() { return this.auth.canAccess(this.subId, 'delete'); }

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.svc.list(this.page, this.pageSize, this.search, this.fdate, this.tdate).subscribe({
      next: res => { this.data = res.data ?? []; this.total = res.total ?? 0; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  onSearch() { this.page = 1; this.load(); }
  onFilter() { this.page = 1; this.load(); }
  clearFilter() { this.fdate = ''; this.tdate = ''; this.page = 1; this.load(); }

  onPage(e: PageEvent) { this.page = e.pageIndex + 1; this.pageSize = e.pageSize; this.load(); }

  add()          { this.router.navigate(['/stock/adjustment/add']); }
  edit(row: any) { this.router.navigate(['/stock/adjustment/edit', row.id]); }

  delete(row: any) {
    if (!confirm(`Delete Stock Adjustment #${row.id}?`)) return;
    this.svc.delete(row.id).subscribe({ next: () => this.load() });
  }
}
