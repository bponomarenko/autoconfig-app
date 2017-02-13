import { EventEmitter } from '@angular/core';
import { User } from '../types';

const USER_KEY = 'autoconfig_user';

export class UserService {
  private _user: User;
  private storage = localStorage;

  onUserChange: EventEmitter<User>;

  constructor() {
    const userString = this.storage.getItem(USER_KEY);
    let user = {};

    try {
      user = JSON.parse(userString);
    } catch(e) {}

    this._user = new User(user);
    this.onUserChange = new EventEmitter<User>();
  }

  get user(): User {
    return this._user;
  }

  set user(user: User) {
    if(!this._user.isEqualTo(user)) {
      this._user = new User(user);
      this.storage.setItem(USER_KEY, JSON.stringify(this.user));
      this.onUserChange.emit(this._user);
    }
  }
}
