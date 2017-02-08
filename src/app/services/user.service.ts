import { EventEmitter } from '@angular/core';

import { User } from '../types/user';

const USER_KEY = 'autoconfig_user';

export class UserService {
  private user: User;
  private storage = localStorage;

  onUserChange: EventEmitter<User>;

  constructor() {
    const userString = this.storage.getItem(USER_KEY);
    let user;

    try {
      user = JSON.parse(userString);
    } catch(e) {
      user = {};
    }

    this.user = new User(user);
    this.onUserChange = new EventEmitter<User>();
  }

  getUser(): User {
    return this.user;
  }

  setUser(user: User) {
    this.user = new User(user);
    this.storage.setItem(USER_KEY, JSON.stringify(this.user));
    this.onUserChange.emit(this.user);
  }
}
