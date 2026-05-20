import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../../../shared/services/product.service';
import { DropdownItem } from '../../../shared/models/product.model';

interface LabelItem {
  id: number;
  code: string;
  name: string;
  qty: number;
  selected: boolean;
}

@Component({
  selector: 'app-label-print',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatTableModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule],
  templateUrl: './label-print.component.html',
  styleUrl: './label-print.component.scss'
})
export class LabelPrintComponent implements OnInit {
  categories: DropdownItem[] = [];
  allProducts: any[] = [];
  filteredProducts: any[] = [];
  labelItems: LabelItem[] = [];
  selectedCategory = '';
  searchProduct = '';
  loading = false;

  displayedColumns = ['select', 'code', 'name', 'qty'];

  constructor(private svc: ProductService) {}

  ngOnInit() {
    this.svc.getAllCategories().subscribe(r => { this.categories = r.data; });
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.svc.getAllProducts().subscribe({
      next: r => {
        this.allProducts = r.data as any[];
        this.filterProducts();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  filterProducts() {
    this.filteredProducts = this.allProducts.filter(p => {
      const matchSearch = !this.searchProduct || p.name.toLowerCase().includes(this.searchProduct.toLowerCase());
      return matchSearch;
    });
  }

  addToLabels(product: any) {
    const exists = this.labelItems.find(i => i.id === product.id);
    if (!exists) {
      this.labelItems = [...this.labelItems, { id: product.id, code: product.code, name: product.name, qty: 1, selected: true }];
    }
  }

  removeLabel(item: LabelItem) {
    this.labelItems = this.labelItems.filter(i => i.id !== item.id);
  }

  print() {
    const items = this.labelItems.filter(i => i.selected && i.qty > 0);
    if (!items.length) { alert('Add at least one product to print'); return; }
    window.print();
  }
}
