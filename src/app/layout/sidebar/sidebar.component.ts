import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { NgClass } from '@angular/common';

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
  user = { name: 'Super Admin', role: 'Admin' };

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
        { label: 'Add Product',  route: '/product/add' },
        { label: 'Product List', route: '/product/list' },
      ]
    },
    { label: 'Service', icon: 'build', children: [
        { label: 'Add Service',  route: '/service/add' },
        { label: 'Service List', route: '/service/list' },
      ]
    },
  ];

  toggle(item: NavItem): void {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }
}
