import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { Notification, NotificationType } from '../types';
import { NotificationsService } from '../services';

const DISMISS_TIMEOUT = 5000;

@Component({
  selector: 'ac-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnDestroy {
  private notifications: Notification[];
  private notificationsSubscription: Subscription;

  constructor(private service: NotificationsService) {
    this.notifications = [];
    this.notificationsSubscription = this.service.onNotificationsUpdate.subscribe(this._onNotificationsUpdate.bind(this));
  }

  ngOnDestroy() {
    this.notificationsSubscription.unsubscribe();
  }

  getAlertType(type: NotificationType): string {
    switch(type) {
      case NotificationType.ERROR:
        return 'danger';
      case NotificationType.SUCCESS:
        return 'success';
      case NotificationType.WARNING:
        return 'warning';
      default:
        return 'info';
    }
  }

  getDismissTimeout(type: NotificationType): number {
    return type === NotificationType.SUCCESS ? DISMISS_TIMEOUT : undefined;
  }

  onNotificationClosed(id: number) {
    this.service.dismiss(id);
  }

  private _onNotificationsUpdate(notifications: Notification[]) {
    this.notifications = notifications;
  }
}
