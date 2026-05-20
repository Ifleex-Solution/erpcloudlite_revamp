import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../../../../shared/services/product.service';
import { DropdownItem } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-conversion-ratio-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule],
  templateUrl: './conversion-ratio-form.component.html',
  styleUrl: './conversion-ratio-form.component.scss'
})
export class ConversionRatioFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id: number | null = null;
  loading = false;
  saving = false;
  products: DropdownItem[] = [];
  units: DropdownItem[] = [];

  constructor(private fb: FormBuilder, private svc: ProductService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.form = this.fb.group({
      product_id:       ['', Validators.required],
      unit_id:          ['', Validators.required],
      conversion_ratio: ['', [Validators.required, Validators.min(0.0001)]],
      status:           ['', Validators.required],
    });

    this.svc.getAllProducts().subscribe(r => { this.products = r.data; });
    this.svc.getAllUnits().subscribe(r => { this.units = r.data; });

    this.id = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    this.isEdit = !!this.id;

    if (this.isEdit) {
      this.loading = true;
      this.svc.getConversionRatio(this.id!).subscribe({
        next: res => {
          const d = res.data as any;
          this.form.patchValue({ product_id: d.product, unit_id: d.subunit, conversion_ratio: d.conversion_ratio, status: d.status });
          this.form.get('product_id')!.disable();
          this.form.get('unit_id')!.disable();
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
    }
  }

  get f() { return this.form.controls; }
  goBack() { this.router.navigate(['/product/conversionratio/list']); }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const val = { ...this.form.getRawValue() };
    const obs = this.isEdit ? this.svc.updateConversionRatio(this.id!, val) : this.svc.saveConversionRatio(val);
    obs.subscribe({ next: () => { this.saving = false; this.goBack(); }, error: () => { this.saving = false; } });
  }
}
