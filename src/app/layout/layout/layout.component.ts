import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

import { TopbarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RealtimeService } from '../../shared/services/realtime.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, MatSnackBarModule, TopbarComponent, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit, OnDestroy {
  sidenavOpened = true;
  private sub!: Subscription;

  constructor(
    private realtime: RealtimeService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.sub = this.realtime.notify$.subscribe(evt => {
      const verb    = evt.action === 'created' ? 'added' : evt.action === 'updated' ? 'updated' : 'deleted';
      const message = `${evt.module} "${evt.recordName}" was ${verb}`;

      this.snackBar.open(message, 'Dismiss', {
        duration:           5000,
        horizontalPosition: 'right',
        verticalPosition:   'top',
        panelClass:         ['product-notify-snack'],
      });
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
