import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
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
import { ProductService } from '../../../../shared/services/product.service';
import { Unit } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-unit-list',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule],
  templateUrl: './unit-list.component.html',
  styleUrl: './unit-list.component.scss'
})
export class UnitListComponent implements OnInit {
  displayedColumns = ['id', 'name', 'display_name', 'status', 'actions'];
  data: Unit[] = [];
  total = 0; page = 1; pageSize = 10; search = ''; loading = false;

  constructor(private svc: ProductService, private router: Router) {}
  private auth = inject(AuthService);
  readonly subId = 8;
  get canCreate() { return this.auth.canAccess(this.subId, 'create'); }
  get canUpdate() { return this.auth.canAccess(this.subId, 'update'); }
  get canDelete() { return this.auth.canAccess(this.subId, 'delete'); }

  
ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.svc.getUnits(this.page, this.pageSize, this.search).subscribe({
      next: res => { this.data = res.data; this.total = res.total; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSearch() { this.page = 1; this.load(); }
  onPage(e: PageEvent) { this.page = e.pageIndex + 1; this.pageSize = e.pageSize; this.load(); }
  add() { this.router.navigate(['/product/unit/add']); }
  edit(row: Unit) { this.router.navigate(['/product/unit/edit', row.id]); }
  delete(row: Unit) {
    if (!confirm(`Delete unit "${row.name}"?`)) return;
    this.svc.deleteUnit(row.id!).subscribe(() => this.load());
  }
}


