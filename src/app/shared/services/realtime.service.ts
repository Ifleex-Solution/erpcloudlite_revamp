import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { environment } from '../../../environments/environment';

export interface RecordNotification {
  module:     string;   // 'Product' | 'Store' | ...
  action:     string;   // 'created' | 'updated' | 'deleted'
  recordId:   number;
  recordName: string;
}

@Injectable({ providedIn: 'root' })
export class RealtimeService implements OnDestroy {
  private echo: Echo<'pusher'>;
  private _notify$ = new Subject<RecordNotification>();

  readonly notify$ = this._notify$.asObservable();

  constructor() {
    (window as any).Pusher = Pusher;

    this.echo = new Echo({
      broadcaster: 'pusher',
      key:         environment.pusherKey,
      cluster:     environment.pusherCluster,
      forceTLS:    true,
    });

    this.echo
      .channel('notifications')
      .listen('.record.saved', (data: RecordNotification) => {
        this._notify$.next(data);
      });
  }

  ngOnDestroy(): void {
    this.echo.disconnect();
    this._notify$.complete();
  }
}
