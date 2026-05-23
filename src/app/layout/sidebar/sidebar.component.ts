import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { NgClass } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

interface NavChild {
  label: string;
  route: string;
}

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavChild[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatDividerModule, MatRippleModule, NgClass],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  user = {
    name: localStorage.getItem('username') ?? 'User',
    role: localStorage.getItem('user_type') ?? 'Staff',
  };

  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Branch',    icon: 'account_tree', children: [
        { label: 'Add Branch',  route: '/branch/add' },
        { label: 'Branch List', route: '/branch/list' },
      ]
    },
    { label: 'Store', icon: 'storefront', children: [
        { label: 'Add Store',  route: '/store/add' },
        { label: 'Store List', route: '/store/list' },
      ]
    },
    { label: 'Product', icon: 'inventory_2', children: [
        { label: 'Brand',             route: '/product/brand/list' },
        { label: 'Origin Of Product', route: '/product/oop/list' },
        { label: 'Category',          route: '/product/category/list' },
        { label: 'Subcategory',       route: '/product/subcategory/list' },
        { label: 'Unit',              route: '/product/unit/list' },
        { label: 'Product',           route: '/product/product-info/list' },
        { label: 'Product Group',     route: '/product/productgroup/list' },
        { label: 'Conversion Ratio',  route: '/product/conversionratio/list' },
        { label: 'Label Print',       route: '/product/labelprint' },
      ]
    },
    { label: 'Service', icon: 'build', children: [
        { label: 'Add Service',  route: '/service/add' },
        { label: 'Service List', route: '/service/list' },
      ]
    },
    { label: 'Settings', icon: 'settings', children: [
        { label: 'Company', route: '/settings/company/list' },
        { label: 'Users',   route: '/settings/user/list'    },
        { label: 'Role',        route: '/settings/role/list'     },
        { label: 'Assign Role', route: '/settings/userrole/list' },
      ]
    },
  ];

  toggle(item: NavItem): void {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }
}
