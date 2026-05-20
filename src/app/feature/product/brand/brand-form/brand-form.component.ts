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
  selector: 'app-brand-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule],
  templateUrl: './brand-form.component.html',
  styleUrl: './brand-form.component.scss'
})
export class BrandFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id: number | null = null;
  loading = false;
  saving = false;

  constructor(private fb: FormBuilder, private svc: ProductService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.form = this.fb.group({
      name:   ['', Validators.required],
      status: ['', Validators.required],
    });

    this.id = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    this.isEdit = !!this.id;

    if (this.isEdit) {
      this.loading = true;
      this.svc.getBrand(this.id!).subscribe({
        next: res => { this.form.patchValue({ name: res.data?.['name'], status: res.data?.['status'] }); this.loading = false; },
        error: () => { this.loading = false; }
      });
    }
  }

  get f() { return this.form.controls; }

  goBack() { this.router.navigate(['/product/brand/list']); }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const payload = this.form.value;
    const obs = this.isEdit ? this.svc.updateBrand(this.id!, payload) : this.svc.saveBrand(payload);
    obs.subscribe({
      next: () => { this.saving = false; this.goBack(); },
      error: () => { this.saving = false; }
    });
  }
}
