import { Component } from '@angular/core';
import { AlertComponent } from 'ng2-bootstrap/alert';

import { NotificationsService } from '../services/notifications.service';
import { Notification, NotificationType } from '../types/notification';

const DISMISS_TIMEOUT = 3000;

@Component({
  selector: 'ac-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  private notifications: Notification[];

  constructor(private service: NotificationsService) {
    this.notifications = [];

    this.service.onNotificationsUpdate.subscribe(this._onNotificationsUpdate.bind(this));
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
    return type === NotificationType.INFO ? DISMISS_TIMEOUT : undefined;
  }

  onNotificationClosed(id: number) {
    this.service.dismiss(id);
  }

  private _onNotificationsUpdate(notifications: Notification[]) {
    this.notifications = notifications;
  }
}
