import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { StockAdjustmentService } from '../../../../shared/services/stock-adjustment.service';
import { MessageService } from '../../../../core/services/message.service';

interface RowState {
  batches:          any[];
  subunits:         any[];
  avQty:            number;
  conversionId:     number | null;
  conversionRatio:  number;
  conversionType:   string;
  filteredProducts: any[];
  // compound-unit display (mirrors legacy mconversion_ratio / bd / ad)
  mconversionRatio:  number;
  bd:                string;   // primary unit label  (e.g. "Kg")
  ad:                string;   // sub-unit label      (e.g. "g")
  selectedUnitName:  string;   // label of the currently selected unit
}

@Component({
  selector: 'app-stock-adjustment-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule, MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatAutocompleteModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './stock-adjustment-form.component.html',
  styleUrl: './stock-adjustment-form.component.scss',
})
export class StockAdjustmentFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isEdit       = false;
  adjId:       number | null = null;
  loading      = false;
  saving       = false;
  oldStocktype = '';

  products:  any[] = [];
  stores:    any[] = [];
  rowStates: RowState[] = [];

  stockTypeOptions: { value: string; label: string }[] = [];
  adjTypeOptions:   { value: string; label: string }[] = [];

  private readonly stockTypeMap: Record<string, { value: string; label: string }[]> = {
    openingstock:    [{ value: 'both',          label: 'Both' }],
    storetransfer:   [{ value: 'actualstock',   label: 'Actual Stock' }],
    stockdisposal:   [{ value: 'actualstock',   label: 'Actual Stock' }],
    stockadjustment: [
      { value: 'actualstock',   label: 'Actual Stock' },
      { value: 'physicalstock', label: 'Physical Stock' },
      { value: 'both',          label: 'Both' },
    ],
  };

  private readonly adjTypeMap: Record<string, { value: string; label: string }[]> = {
    openingstock:    [{ value: 'increase', label: 'Increase' }],
    storetransfer:   [{ value: 'increase', label: 'Increase' }, { value: 'decrease', label: 'Decrease' }],
    stockdisposal:   [{ value: 'decrease', label: 'Decrease' }],
    stockadjustment: [{ value: 'increase', label: 'Increase' }, { value: 'decrease', label: 'Decrease' }],
  };

  private destroy$ = new Subject<void>();

  private svc     = inject(StockAdjustmentService);
  private message = inject(MessageService);
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);
  private fb      = inject(FormBuilder);

  get items(): FormArray { return this.form.get('items') as FormArray; }

  // ── displayWith for mat-autocomplete ──────────────────────────────────────
  displayProduct = (p: any): string => {
    if (!p) return '';
    if (typeof p === 'string') return p;
    return p.name ?? '';
  };

  // ── Av.Qty display (mirrors legacy avStock compound-unit logic) ───────────
  getAvQtyDisplay(i: number): string {
    const rs   = this.rowStates[i];
    const raw  = rs.avQty;
    const unit = rs.selectedUnitName;

    // Subunit selected with a conversion — show converted value + selected unit name
    if (rs.conversionType) {
      return unit ? `${raw.toFixed(2)} ${unit}` : raw.toFixed(2);
    }

    // Primary unit selected, compound sub-unit exists — e.g. "5 Kg  300 g"
    if (rs.mconversionRatio > 0 && rs.bd && rs.ad) {
      const intPart = Math.floor(raw);
      const subPart = Math.floor((rs.mconversionRatio * raw) % rs.mconversionRatio);
      return `${intPart} ${rs.bd}  ${subPart} ${rs.ad}`;
    }

    // Primary unit, no compound sub-unit — show plain with primary unit name
    if (rs.bd) {
      return `${raw.toFixed(2)} ${rs.bd}`;
    }

    return raw.toFixed(2);
  }

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];
    this.form = this.fb.group({
      date:          [today, Validators.required],
      incident_type: ['', Validators.required],
      stock_type:    ['', Validators.required],
      reason:        [''],
      items:         this.fb.array([]),
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.isEdit = true; this.adjId = +id; }

    this.loading = true;
    forkJoin({ products: this.svc.getProducts(), stores: this.svc.getStores() })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ products, stores }) => {
          this.products = products.data ?? [];
          this.stores   = stores.data   ?? [];
          if (this.isEdit) {
            this.loadEditData(this.adjId!);
          } else {
            this.addRow();
            this.loading = false;
          }
        },
        error: () => { this.loading = false; this.message.error('Failed to load data.'); },
      });
  }

  // ── Incident / Stock Type cascading ────────────────────────────────────────

  onIncidentTypeChange(): void {
    const t = this.form.value.incident_type;
    this.stockTypeOptions = this.stockTypeMap[t] ?? [];
    this.adjTypeOptions   = this.adjTypeMap[t]   ?? [];

    this.form.get('stock_type')!.setValue(
      this.stockTypeOptions.length === 1 ? this.stockTypeOptions[0].value : ''
    );
    const singleAdj = this.adjTypeOptions.length === 1 ? this.adjTypeOptions[0].value : '';
    this.items.controls.forEach(g => g.get('adj_type')!.setValue(singleAdj));

    this.clearRows();
  }

  onStockTypeChange(): void {
    this.clearRows();
  }

  private clearRows(): void {
    while (this.items.length) this.items.removeAt(0);
    this.rowStates = [];
    if (this.form.value.incident_type && this.form.value.stock_type) {
      this.addRow();
    }
  }

  // ── Row management ─────────────────────────────────────────────────────────

  addRow(): void {
    if (!this.form.value.incident_type) {
      this.message.error('Please select an Incident Type first.');
      return;
    }
    const group = this.fb.group({
      product_id:   ['', Validators.required],
      product_name: [''],
      store_id:     ['', Validators.required],
      batch_id:     [''],
      unit_id:      ['', Validators.required],
      adj_type:     [this.adjTypeOptions.length === 1 ? this.adjTypeOptions[0].value : '', Validators.required],
      adj_qty:      ['', [Validators.required, Validators.min(0.001)]],
    });
    this.items.push(group);
    this.rowStates.push(this.emptyRowState());
  }

  removeRow(i: number): void {
    this.items.removeAt(i);
    this.rowStates.splice(i, 1);
  }

  private emptyRowState(): RowState {
    return {
      batches: [], subunits: [], avQty: 0,
      conversionId: null, conversionRatio: 1, conversionType: '',
      filteredProducts: this.products.slice(0, 50),
      mconversionRatio: 0, bd: '', ad: '', selectedUnitName: '',
    };
  }

  // ── Product autocomplete ───────────────────────────────────────────────────

  filterProducts(i: number, term: string): void {
    const t = (term ?? '').toLowerCase().trim();
    this.rowStates[i].filteredProducts = t.length === 0
      ? this.products.slice(0, 50)
      : this.products.filter(p => p.name.toLowerCase().includes(t)).slice(0, 50);
    this.items.at(i).get('product_id')!.setValue('');
  }

  onProductSelect(i: number, product: any): void {
    // Patch form values — store auto-filled from product.store
    this.items.at(i).patchValue({
      product_id:   product.id,
      product_name: product,
      store_id:     product.store || '',
      batch_id:     '',
      unit_id:      '',
    });

    // Reset row state (keep filteredProducts)
    this.rowStates[i] = {
      ...this.rowStates[i],
      batches: [], subunits: [], avQty: 0,
      conversionId: null, conversionRatio: 1, conversionType: '',
      mconversionRatio: 0, bd: '', ad: '',
    };

    forkJoin({
      batches:  this.svc.getBatches(product.id, product.batchtype ?? 0),
      subunits: this.svc.getSubunits(product.id),
    }).subscribe({
      next: ({ batches, subunits }) => {
        const subList    = subunits.data ?? [];
        const primaryU   = subList.find((u: any) =>  u.is_primary);
        const firstSubU  = subList.find((u: any) => !u.is_primary&&u.first);

        this.rowStates[i].batches          = batches.data ?? [];
        this.rowStates[i].subunits         = subList;
        this.rowStates[i].bd               = primaryU?.unit_name   ?? '';
        this.rowStates[i].ad               = firstSubU?.unit_name  ?? '';
        this.rowStates[i].mconversionRatio = parseFloat(firstSubU?.conversion_ratio ?? '0') || 0;

        // Auto-select batch when only one option
        if (this.rowStates[i].batches.length >0) {
          this.items.at(i).patchValue({ batch_id: this.rowStates[i].batches[0].id });
        }

        // Auto-select primary unit then trigger conversion + avQty refresh
        if (subList.length > 0) {
          this.items.at(i).patchValue({ unit_id: subList[0].unit_id });
          this.rowStates[i].selectedUnitName = subList[0].unit_name ?? '';
          this.onUnitChange(i);   // fetches conversion → refreshAvQty
        } else {
          this.refreshAvQty(i);   // no units, but still show compound/raw avQty
        }
      },
    });
  }

  // ── Field change handlers ──────────────────────────────────────────────────

  onStoreChange(i: number): void {
    this.refreshAvQty(i);
  }

  onBatchChange(i: number): void {
    this.refreshAvQty(i);
  }

  onUnitChange(i: number): void {
    const v = this.items.at(i).value;
    if (!v.product_id || !v.unit_id) return;

    // Resolve selected unit name immediately (no API needed)
    const selectedUnit = this.rowStates[i].subunits.find((u: any) => u.unit_id == v.unit_id);
    this.rowStates[i].selectedUnitName = selectedUnit?.unit_name ?? '';

    this.svc.getConversion(+v.product_id, +v.unit_id).subscribe({
      next: res => {
        const d = res.data;
        if (d) {
          this.rowStates[i].conversionId    = d.conversionratio_id;
          this.rowStates[i].conversionRatio = parseFloat(d.conversion_ratio) || 1;
          this.rowStates[i].conversionType  = d.convertiontype ?? '';
        } else {
          this.rowStates[i].conversionId    = null;
          this.rowStates[i].conversionRatio = 1;
          this.rowStates[i].conversionType  = '';
        }
        this.refreshAvQty(i);
      },
    });
  }

  onAdjQtyChange(i: number): void {
    if (this.isEdit) return;
    const v      = this.items.at(i).value;
    const adjQty = parseFloat(v.adj_qty);
    if (v.adj_type === 'decrease' && adjQty > this.rowStates[i].avQty && this.rowStates[i].avQty > 0) {
      this.message.error(`Quantity (${adjQty}) exceeds available stock (${this.rowStates[i].avQty.toFixed(2)})`);
      this.items.at(i).get('adj_qty')!.setValue('');
    }
  }

  private refreshAvQty(i: number): void {
    const v         = this.items.at(i).value;
    const stocktype = this.form.value.stock_type;

    if (!v.product_id || !v.store_id || stocktype === 'both') {
      this.rowStates[i].avQty = 0;
      return;
    }

    this.svc.getAvStock(+v.product_id, +v.store_id, v.batch_id ?? 1, stocktype).subscribe({
      next: res => {
        const raw = res.data?.avgqty ?? 0;
        this.rowStates[i].avQty = this.applyConversionDisplay(raw, i);
      },
    });
  }

  private applyConversionDisplay(raw: number, i: number): number {
    const t = this.rowStates[i].conversionType;
    const r = this.rowStates[i].conversionRatio;
    if (!t || r === 0) return raw;
    if (t === '*') return raw * r;
    if (t === '/') return raw / r;
    if (t === '+') return raw + r;
    if (t === '-') return raw - r;
    return raw;
  }

  private applyConversionSave(qty: number, i: number): number {
    const t = this.rowStates[i].conversionType;
    const r = this.rowStates[i].conversionRatio;
    if (!t || r === 0) return qty;
    if (t === '*') return qty / r;
    if (t === '/') return qty * r;
    if (t === '+') return qty - r;
    if (t === '-') return qty + r;
    return qty;
  }

  // ── Save ───────────────────────────────────────────────────────────────────

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const combos = this.items.controls.map(g => ({
      product: g.value.product_id, store: g.value.store_id, batch: g.value.batch_id,
    }));
    const hasDup = combos.some((c, idx) =>
      c.product && combos.findIndex(x => x.product == c.product && x.store == c.store && x.batch == c.batch) !== idx
    );
    if (hasDup) {
      this.message.error('Duplicate product/store/batch combination is not allowed.');
      return;
    }

    const fv    = this.form.value;
    const items = this.items.controls.map((g, i) => {
      const v        = g.value;
      const rs       = this.rowStates[i];
      const qty      = this.applyConversionSave(parseFloat(v.adj_qty) || 0, i);
      const unitName = rs.subunits.find((u: any) => u.unit_id == v.unit_id)?.unit_name ?? '';

      return {
        product:      v.product_id,
        store:        v.store_id,
        batch:        v.batch_id || 0,
        unit:         v.unit_id,
        adj:          v.adj_type,
        quantity:     qty,
        aqty:         `${v.adj_qty} ${unitName}`,
        conversionid: rs.conversionId ?? '',
        date:         fv.date,
        reason:       fv.reason || '',
        type:         fv.incident_type,
        stocktype:    fv.stock_type,
      };
    });

    this.saving = true;
    const payload  = { items };
    const obs$     = this.isEdit
      ? this.svc.update(this.adjId!, { ...payload, oldStocktype: this.oldStocktype })
      : this.svc.save(payload);

    obs$.pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        this.message.success(res.message ?? (this.isEdit ? 'Updated.' : 'Saved.'));
        this.goBack();
      },
      error: () => { this.saving = false; },
    });
  }

  goBack(): void { this.router.navigate(['/stock/adjustment/list']); }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  // ── Edit loader ────────────────────────────────────────────────────────────

  private loadEditData(id: number): void {
    this.svc.getById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        const h     = res.data.header;
        const items: any[] = res.data.items ?? [];
        this.oldStocktype = h.stocktype;

        this.stockTypeOptions = this.stockTypeMap[h.type]  ?? [];
        this.adjTypeOptions   = this.adjTypeMap[h.type]    ?? [];
        this.form.patchValue({ date: h.date, incident_type: h.type, stock_type: h.stocktype, reason: h.reason ?? '' });

        if (items.length === 0) {
          this.addRow();
          this.loading = false;
          return;
        }

        const rowLoaders = items.map((item: any) => {
          const product   = this.products.find(p => p.id == item.product_id);
          const batchtype = product?.batchtype ?? 0;
          return forkJoin({
            batches:    this.svc.getBatches(item.product_id, batchtype),
            subunits:   this.svc.getSubunits(item.product_id),
            conversion: item.conversion_id
              ? this.svc.getConversion(item.product_id, item.unit_id)
              : of({ data: null }),
          });
        });

        forkJoin(rowLoaders).pipe(takeUntil(this.destroy$)).subscribe({
          next: (results: any[]) => {
            while (this.items.length) this.items.removeAt(0);
            this.rowStates = [];

            results.forEach((r: any, i: number) => {
              const item     = items[i];
              const product  = this.products.find(p => p.id == item.product_id) ?? null;
              const cd       = r.conversion?.data;
              const subList  = r.subunits.data ?? [];
              const primaryU = subList.find((u: any) =>  u.is_primary);
              const firstSub = subList.find((u: any) => !u.is_primary&&u.first);

              const savedUnit = subList.find((u: any) => u.unit_id == item.unit_id);

              const rs: RowState = {
                batches:          r.batches.data ?? [],
                subunits:         subList,
                avQty:            0,
                conversionId:     cd?.conversionratio_id ?? null,
                conversionRatio:  parseFloat(cd?.conversion_ratio ?? '1') || 1,
                conversionType:   cd?.convertiontype ?? '',
                filteredProducts: this.products.slice(0, 50),
                mconversionRatio: parseFloat(firstSub?.conversion_ratio ?? '0') || 0,
                bd:               primaryU?.unit_name  ?? '',
                ad:               firstSub?.unit_name  ?? '',
                selectedUnitName: savedUnit?.unit_name ?? '',
              };
              this.rowStates.push(rs);
              rs.avQty = this.applyConversionDisplay(item.avstock ?? 0, i);

              const group = this.fb.group({
                product_id:   [item.product_id, Validators.required],
                product_name: [product],
                store_id:     [item.store_id,   Validators.required],
                batch_id:     [item.batch_id],
                unit_id:      [item.unit_id,    Validators.required],
                adj_type:     [item.adj_type,   Validators.required],
                adj_qty:      [+(item.adjusted_qty ?? 0), [Validators.required, Validators.min(0.001)]],
              });
              this.items.push(group);
            });

            this.loading = false;
          },
          error: () => { this.loading = false; },
        });
      },
      error: () => {
        this.loading = false;
        this.message.error('Failed to load adjustment.');
        this.goBack();
      },
    });
  }
}
