import { User } from '../types';

interface Configuration {
  user: User;
  baseUrl?: string;
}

const DATA_KEY = 'autoconfig_configuration';

export class ConfigurationService {
  private _configuration: Configuration;
  private storage = localStorage;

  get user(): User {
    return this.configuration.user;
  }

  set user(user: User) {
    if(!this.configuration.user.isEqualTo(user)) {
      this._configuration.user = new User(user);
      this._saveConfiguration();
    }
  }

  get baseUrl(): string {
    return this.configuration.baseUrl;
  }

  set baseUrl(url: string) {
    const newUrl = url.endsWith('/') ? url : url + '/';
    if(this.configuration.baseUrl !== newUrl) {
      this._configuration.baseUrl = newUrl;
      this._saveConfiguration();
    }
  }

  private get configuration(): Configuration {
    if(!this._configuration) {
      const dataString = this.storage.getItem(DATA_KEY);
      let data: any = {};

      try {
        data = JSON.parse(dataString);
      } catch(e) {}

      this._configuration = Object.assign({}, data, {
        user: new User(data.user)
      });
    }
    return this._configuration;
  }

  private _saveConfiguration() {
    this.storage.setItem(DATA_KEY, JSON.stringify(this._configuration));
  }
}
