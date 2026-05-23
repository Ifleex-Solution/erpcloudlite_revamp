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
import { Category } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
  displayedColumns = ['id', 'name', 'status', 'actions'];
  data: Category[] = [];
  total = 0; page = 1; pageSize = 10; search = ''; loading = false;

  constructor(private svc: ProductService, private router: Router) {}
  private auth = inject(AuthService);
  readonly subId = 6;
  get canCreate() { return this.auth.canAccess(this.subId, 'create'); }
  get canUpdate() { return this.auth.canAccess(this.subId, 'update'); }
  get canDelete() { return this.auth.canAccess(this.subId, 'delete'); }

  
ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.svc.getCategories(this.page, this.pageSize, this.search).subscribe({
      next: res => { this.data = res.data; this.total = res.total; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSearch() { this.page = 1; this.load(); }
  onPage(e: PageEvent) { this.page = e.pageIndex + 1; this.pageSize = e.pageSize; this.load(); }
  add() { this.router.navigate(['/product/category/add']); }
  edit(row: Category) { this.router.navigate(['/product/category/edit', row.id]); }
  delete(row: Category) {
    if (!confirm(`Delete category "${row.name}"?`)) return;
    this.svc.deleteCategory(row.id!).subscribe(() => this.load());
  }
}


