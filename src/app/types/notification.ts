export enum NotificationType {
  ERROR,
  INFO,
  SUCCESS,
  WARNING
}

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}
