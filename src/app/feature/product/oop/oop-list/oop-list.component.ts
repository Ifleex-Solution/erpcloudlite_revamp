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
import { Oop } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-oop-list',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule],
  templateUrl: './oop-list.component.html',
  styleUrl: './oop-list.component.scss'
})
export class OopListComponent implements OnInit {
  displayedColumns = ['id', 'name', 'status', 'actions'];
  data: Oop[] = [];
  total = 0; page = 1; pageSize = 10; search = ''; loading = false;

  constructor(private svc: ProductService, private router: Router) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.svc.getOops(this.page, this.pageSize, this.search).subscribe({
      next: res => { this.data = res.data; this.total = res.total; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSearch() { this.page = 1; this.load(); }
  onPage(e: PageEvent) { this.page = e.pageIndex + 1; this.pageSize = e.pageSize; this.load(); }
  add() { this.router.navigate(['/product/oop/add']); }
  edit(row: Oop) { this.router.navigate(['/product/oop/edit', row.id]); }
  delete(row: Oop) {
    if (!confirm(`Delete "${row.name}"?`)) return;
    this.svc.deleteOop(row.id!).subscribe(() => this.load());
  }
}
