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
  selector: 'app-subcategory-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule],
  templateUrl: './subcategory-form.component.html',
  styleUrl: './subcategory-form.component.scss'
})
export class SubcategoryFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id: number | null = null;
  loading = false;
  saving = false;
  categories: DropdownItem[] = [];

  constructor(private fb: FormBuilder, private svc: ProductService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.form = this.fb.group({
      name:        ['', Validators.required],
      category_id: ['', Validators.required],
      status:      ['', Validators.required],
    });

    this.svc.getAllCategories().subscribe(res => { this.categories = res.data; });

    this.id = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    this.isEdit = !!this.id;

    if (this.isEdit) {
      this.loading = true;
      this.svc.getSubcategory(this.id!).subscribe({
        next: res => {
          this.form.patchValue({ name: res.data?.['name'], category_id: res.data?.['category_id'], status: +(res.data?.['status'] ?? 0) });
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
    }
  }

  get f() { return this.form.controls; }
  goBack() { this.router.navigate(['/product/subcategory/list']); }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const obs = this.isEdit ? this.svc.updateSubcategory(this.id!, { ...this.form.value, status: +(this.form.value.status ?? 0) }) : this.svc.saveSubcategory({ ...this.form.value, status: +(this.form.value.status ?? 0) });
    obs.subscribe({ next: () => { this.saving = false; this.goBack(); }, error: () => { this.saving = false; } });
  }
}
