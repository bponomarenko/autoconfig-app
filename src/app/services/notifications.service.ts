import { Injectable, Output, EventEmitter } from '@angular/core';

import { Notification, NotificationType } from '../types/notification';

@Injectable()
export class NotificationsService {
  private notifications: Notification[];

  @Output() onNotificationsUpdate: EventEmitter<Notification[]>;

  constructor() {
    this.notifications = [];
    this.onNotificationsUpdate = new EventEmitter<Notification[]>();
  }

  addError(message: string): number {
    return this._addNotification(NotificationType.ERROR, message);
  }

  addSuccess(message: string): number {
    return this._addNotification(NotificationType.SUCCESS, message);
  }

  addWarning(message: string): number {
    return this._addNotification(NotificationType.WARNING, message);
  }

  dismiss(notificationId: number) {
    const index = this.notifications.findIndex(notification => notification.id === notificationId);
    if(index !== -1) {
      this.notifications.splice(index, 1);
      this._notify();
    }
  }

  private _addNotification(type: NotificationType, message: string): number {
    const notification = this._getNotification(type, message);
    this.notifications.push(notification);
    this._notify();
    return notification.id;
  }

  private _notify() {
    this.onNotificationsUpdate.emit([].concat(this.notifications));
  }

  private _getNotification(type: NotificationType, message: string) {
    return {
      id: Date.now(),
      type,
      message
    }
  }
}
