import { EventEmitter } from '@angular/core';
import { Notification, NotificationType } from '../types';

export class NotificationsService {
  private _notifications: Notification[];

  onNotificationsUpdate: EventEmitter<Notification[]>;

  constructor() {
    this._notifications = [];
    this.onNotificationsUpdate = new EventEmitter<Notification[]>();
  }

  get notifications() {
    return this._notifications;
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

  dismiss(id: number) {
    const index = this._notifications.findIndex(notification => notification.id === id);
    if(index !== -1) {
      this.notifications.splice(index, 1);
      this._notify();
    }
  }

  private _addNotification(type: NotificationType, message: string): number {
    const notification = this._getNotification(type, message);
    this._notifications.push(notification);
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
