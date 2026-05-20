import { Component, OnInit } from '@angular/core';
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
import { ProductInfo } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-product-info-list',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule],
  templateUrl: './product-info-list.component.html',
  styleUrl: './product-info-list.component.scss'
})
export class ProductInfoListComponent implements OnInit {
  displayedColumns = ['id', 'code', 'name', 'category_name', 'unit_name', 'product_type', 'status', 'actions'];
  data: ProductInfo[] = [];
  total = 0; page = 1; pageSize = 10; search = ''; loading = false;

  constructor(private svc: ProductService, private router: Router) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.svc.getProducts(this.page, this.pageSize, this.search).subscribe({
      next: res => { this.data = res.data; this.total = res.total; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSearch() { this.page = 1; this.load(); }
  onPage(e: PageEvent) { this.page = e.pageIndex + 1; this.pageSize = e.pageSize; this.load(); }
  add() { this.router.navigate(['/product/product-info/add']); }
  edit(row: ProductInfo) { this.router.navigate(['/product/product-info/edit', row.id]); }
  delete(row: ProductInfo) {
    if (!confirm(`Delete product "${row.name}"?`)) return;
    this.svc.deleteProduct(row.id!).subscribe(() => this.load());
  }
}
