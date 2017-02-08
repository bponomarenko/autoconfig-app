export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

export enum NotificationType {
  ERROR,
  INFO,
  SUCCESS,
  WARNING
}
