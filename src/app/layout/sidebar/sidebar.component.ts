import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { NgClass } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

interface NavChild {
  label:       string;
  route:       string;
  submoduleId: number;
}

interface NavItem {
  label:        string;
  icon:         string;
  route?:       string;
  submoduleId?: number;
  children?:    NavChild[];
  expanded?:    boolean;
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
    name: sessionStorage.getItem('username') ?? 'User',
    role: sessionStorage.getItem('user_level') ?? 'Staff',
  };

  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }

  canRead(submoduleId: number): boolean {
    return this.auth.canAccess(submoduleId, 'read');
  }

  hasAnyChildAccess(item: NavItem): boolean {
    if (!item.children) return item.submoduleId ? this.canRead(item.submoduleId) : true;
    return item.children.some(c => this.canRead(c.submoduleId));
  }

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', submoduleId: 1 },
    {
      label: 'Branch', icon: 'account_tree', children: [
        { label: 'Branch List', route: '/branch/list', submoduleId: 2 },
      ]
    },
    {
      label: 'Store', icon: 'storefront', children: [
        { label: 'Store List', route: '/store/list', submoduleId: 3 },
      ]
    },
    {
      label: 'Product', icon: 'inventory_2', children: [
        { label: 'Brand',             route: '/product/brand/list',           submoduleId: 4  },
        { label: 'Origin Of Product', route: '/product/oop/list',             submoduleId: 5  },
        { label: 'Category',          route: '/product/category/list',        submoduleId: 6  },
        { label: 'Subcategory',       route: '/product/subcategory/list',     submoduleId: 7  },
        { label: 'Unit',              route: '/product/unit/list',            submoduleId: 8  },
        { label: 'Product',           route: '/product/product-info/list',    submoduleId: 9  },
        { label: 'Product Group',     route: '/product/productgroup/list',    submoduleId: 10 },
        { label: 'Conversion Ratio',  route: '/product/conversionratio/list', submoduleId: 11 },
        { label: 'Label Print',       route: '/product/labelprint',           submoduleId: 9  },
      ]
    },
    {
      label: 'Service', icon: 'build', children: [
        { label: 'Service List', route: '/service/list', submoduleId: 12 },
      ]
    },
    {
      label: 'Settings', icon: 'settings', children: [
        { label: 'Company',     route: '/settings/company/list',   submoduleId: 13 },
        { label: 'Users',       route: '/settings/user/list',      submoduleId: 14 },
        { label: 'Role',        route: '/settings/role/list',      submoduleId: 15 },
        { label: 'Assign Role', route: '/settings/userrole/list',  submoduleId: 16 },
      ]
    },
  ];

  toggle(item: NavItem): void {
    if (item.children) item.expanded = !item.expanded;
  }
}
