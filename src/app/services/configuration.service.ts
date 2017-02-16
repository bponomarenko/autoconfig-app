import { EventEmitter } from '@angular/core';
import { User } from '../types';

interface Configuration {
  user: User;
}

const DATA_KEY = 'autoconfig_configuration';

export class ConfigurationService {
  private _configuration: Configuration;
  private storage = localStorage;

  onUserChange: EventEmitter<User>;

  constructor() {
    this.onUserChange = new EventEmitter<User>();
  }

  get user(): User {
    return this.configuration.user;
  }

  set user(user: User) {
    if(!this._configuration.user.isEqualTo(user)) {
      this._configuration.user = new User(user);
      this._saveConfiguration();
      this.onUserChange.emit(this._configuration.user);
    }
  }

  private get configuration(): Configuration {
    if(!this._configuration) {
      const dataString = this.storage.getItem(DATA_KEY);
      let data: any = {};

      try {
        data = JSON.parse(dataString);
      } catch(e) {}

      this._configuration = {
        user: new User(data.user)
      };
    }
    return this._configuration;
  }

  private _saveConfiguration() {
    this.storage.setItem(DATA_KEY, JSON.stringify(this._configuration));
  }
}
