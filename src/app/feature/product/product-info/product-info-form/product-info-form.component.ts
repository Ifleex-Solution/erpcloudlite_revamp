import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../../../shared/services/product.service';
import { DropdownItem, SubstockEntry } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-product-info-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, FormsModule,
    MatCardModule, MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatProgressSpinnerModule, MatCheckboxModule, MatTooltipModule, MatSnackBarModule
  ],
  templateUrl: './product-info-form.component.html',
  styleUrl: './product-info-form.component.scss'
})
export class ProductInfoFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id: number | null = null;
  loading = false;
  saving = false;

  // Dropdowns
  categories: DropdownItem[] = [];
  subcategories: DropdownItem[] = [];
  units: DropdownItem[] = [];
  brands: DropdownItem[] = [];
  oops: DropdownItem[] = [];
  stores: DropdownItem[] = [];
  suppliers: DropdownItem[] = [];

  productTypes = ['N/A', 'Retail Good', 'Finished Good', 'Ingredients', 'Raw Material', 'Packing Material', 'MRO'];

  // Substock
  entries: SubstockEntry[] = [];
  showAddPanel = false;
  editingIndex = -1;
  addUnitId: number | string = '';
  addSubcostPrice: number | string = '';
  addSubsellPrice: number | string = '';

  constructor(
    private fb: FormBuilder,
    private svc: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      code:               [''],
      name:               ['', Validators.required],
      category_id:        ['', Validators.required],
      subcategory_id:     [''],
      unit_id:            ['', Validators.required],
      brand_id:           [''],
      oop_id:             [''],
      product_type:       ['N/A', Validators.required],
      store:              ['', Validators.required],
      product_vat:        [''],
      defaultsaleprice:   ['', Validators.required],
      batchtype:          ['', Validators.required],
      serial_no:          [''],
      product_model:      [''],
      product_details:    [''],
      printname:          [''],
      cost_price:         [''],
      price:              [''],
      supplier_id:        [''],
      stock:              [1, Validators.required],
      max_stock_level:    [''],
      min_stock_level:    [''],
      reorder_stock_level:[''],
      reserve_stock_level:[''],
      status:             ['', Validators.required],
    });

    // Load all dropdowns in one request
    this.svc.getAllDropdowns().subscribe(r => {
      this.categories = r.categories;
      this.units      = r.units;
      this.brands     = r.brands;
      this.oops       = r.oops;
      this.stores     = r.stores;
      this.suppliers  = r.suppliers;
    });

    // Subcategory cascade
    this.form.get('category_id')!.valueChanges.subscribe(catId => {
      this.form.get('subcategory_id')!.setValue('');
      if (catId) {
        this.svc.getSubcategoriesByCategory(catId).subscribe(r => { this.subcategories = r.data; });
      } else {
        this.subcategories = [];
      }
    });

    this.id = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    this.isEdit = !!this.id;

    if (this.isEdit) {
      this.loading = true;
      this.svc.getProduct(this.id!).subscribe({
        next: res => {
          const d = res.data as any;
          // Cast VARCHAR/BIGINT DB fields to numbers so mat-select option matching works
          const catId      = d.category_id    ? +d.category_id    : '';
          const subcatId   = d.subcategory_id ? +d.subcategory_id : '';
          const unitId     = d.unit           ? +d.unit           : '';
          const brandId    = d.brand_id       ? +d.brand_id       : '';
          const oopId      = d.oop_id         ? +d.oop_id         : '';
          const storeId    = d.store          ? +d.store          : '';
          const supplierId = d.supplier_id    ? +d.supplier_id    : '';
          const batchtypeV = d.batchtype !== null && d.batchtype !== '' ? +d.batchtype : '';

          this.form.patchValue({
            code: d.product_id,
            name: d.product_name, category_id: catId, subcategory_id: subcatId,
            unit_id: unitId, brand_id: brandId, oop_id: oopId,
            product_type: d.product_type || 'N/A', store: storeId,
            product_vat: d.product_vat, defaultsaleprice: d.defaultsaleprice,
            batchtype: batchtypeV, serial_no: d.serial_no,
            product_model: d.product_model, product_details: d.product_details,
            printname: d.printname, cost_price: d.cost_price, price: d.price,
            supplier_id: supplierId, stock: d.stock !== null && d.stock !== undefined ? +d.stock : 1,
            max_stock_level: d.max_stock_level, min_stock_level: d.min_stock_level,
            reorder_stock_level: d.reorder_stock_level, reserve_stock_level: d.reserve_stock_level,
            status: d.status !== null ? +d.status : '',
          });

          if (catId) {
            this.svc.getSubcategoriesByCategory(+catId).subscribe(r => {
              this.subcategories = r.data;
              this.form.patchValue({ subcategory_id: subcatId });
            });
          }

          // Load subunits from response
          const subunits: any[] = (res as any).subunits || [];
          this.entries = subunits.map(su => ({
            id: su.id,
            subunitid: su.unit_id,
            subunit: su.unit_name,
            subcost_price: su.subcost_price,
            subsell_price: su.subsell_price,
            selected: su.first === 1,
            selectedInt: su.first,
          }));

          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
    } else {
      this.svc.getProductNextCode().subscribe(r => { this.form.patchValue({ code: r.code }); });
    }
  }

  get f() { return this.form.controls; }

  goBack() { this.router.navigate(['/product/product-info/list']); }

  // ── Substock ────────────────────────────────────────────────────────────────

  addSubstock() {
    if (!this.addUnitId) { alert('Please select a substock unit'); return; }

    if (+this.addUnitId === +this.form.value.unit_id) {
      alert('Substock unit cannot be the same as Master Stock Unit');
      return;
    }
    if (this.entries.find(e => +e.subunitid === +this.addUnitId)) {
      alert('This substock unit is already added');
      return;
    }

    const unit = this.units.find(u => u.id === +this.addUnitId);
    this.entries = [...this.entries, {
      id: 0,
      subunitid: +this.addUnitId,
      subunit: unit?.name ?? '',
      subcost_price: this.addSubcostPrice || 0,
      subsell_price: this.addSubsellPrice || 0,
      selected: false,
      selectedInt: 0,
    }];

    // Reset add panel
    this.addUnitId = '';
    this.addSubcostPrice = '';
    this.addSubsellPrice = '';
    this.showAddPanel = false;
  }

  removeSubstock(index: number) {
    const entry = this.entries[index];
    if (!confirm(`Remove substock unit "${entry.subunit}"?`)) return;

    if (entry.id > 0) {
      // Existing DB record — delete via API
      this.svc.deleteSubunit(entry.id).subscribe({
        next: () => {
          this.entries = this.entries.filter((_, i) => i !== index);
          if (this.editingIndex === index) this.editingIndex = -1;
        }
      });
    } else {
      this.entries = this.entries.filter((_, i) => i !== index);
      if (this.editingIndex === index) this.editingIndex = -1;
    }
  }

  togglePrimary(index: number) {
    const wasSelected = this.entries[index].selected;
    this.entries = this.entries.map((e, i) => ({
      ...e,
      selected: i === index ? !wasSelected : false,
      selectedInt: i === index ? (wasSelected ? 0 : 1) : 0,
    }));
  }

  startEdit(index: number) { this.editingIndex = index; }
  finishEdit()             { this.editingIndex = -1; }

  // ── Save ────────────────────────────────────────────────────────────────────

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    // Substock validation
    if (this.entries.length > 0) {
      const primaryCount = this.entries.filter(e => e.selected).length;
      if (primaryCount === 0) {
        alert('Please mark one substock unit as Primary');
        return;
      }
    }

    this.saving = true;
    const val = this.form.value;

    const obs = this.isEdit
      ? this.svc.updateProduct(this.id!, val, this.entries)
      : this.svc.saveProduct(val, this.entries);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.snack.open(this.isEdit ? 'Product updated successfully' : 'Product saved successfully', 'Close', { duration: 3000, panelClass: ['snack-success'] });
        this.goBack();
      },
      error: () => {
        this.saving = false;
        this.snack.open('Failed to save product. Please try again.', 'Close', { duration: 4000, panelClass: ['snack-error'] });
      }
    });
  }
}
