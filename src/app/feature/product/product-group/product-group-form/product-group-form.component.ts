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

@Component({
  selector: 'app-product-group-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule],
  templateUrl: './product-group-form.component.html',
  styleUrl: './product-group-form.component.scss'
})
export class ProductGroupFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id: number | null = null;
  loading = false;
  saving = false;

  constructor(private fb: FormBuilder, private svc: ProductService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.form = this.fb.group({
      code:          [''],
      name:          ['', Validators.required],
      invoice_group: ['', Validators.required],
      status:        ['', Validators.required],
    });

    this.id = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    this.isEdit = !!this.id;

    if (this.isEdit) {
      this.loading = true;
      this.svc.getProductGroup(this.id!).subscribe({
        next: res => { this.form.patchValue({ code: res.data?.['code'], name: res.data?.['name'], invoice_group: res.data?.['invoice_group'], status: res.data?.['status'] }); this.loading = false; },
        error: () => { this.loading = false; }
      });
    } else {
      this.svc.getProductGroupNextCode().subscribe(r => { this.form.patchValue({ code: r.code }); });
    }
  }

  get f() { return this.form.controls; }
  goBack() { this.router.navigate(['/product/productgroup/list']); }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const obs = this.isEdit ? this.svc.updateProductGroup(this.id!, this.form.value) : this.svc.saveProductGroup(this.form.value);
    obs.subscribe({ next: () => { this.saving = false; this.goBack(); }, error: () => { this.saving = false; } });
  }
}
