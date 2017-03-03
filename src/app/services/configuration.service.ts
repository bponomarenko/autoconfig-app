import { User } from '../types';

interface Configuration {
  user: User;
  baseUrl?: string;
  provision: ProvisionConfiguration;
  urls: NavigationURL[];
}

interface ProvisionConfiguration {
  [key: string]: any;
}

interface NavigationURL {
  name: string;
  value: string;
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
      this.saveConfiguration();
    }
  }

  get baseUrl(): string {
    return this.configuration.baseUrl;
  }

  set baseUrl(url: string) {
    const newUrl = url.endsWith('/') ? url : url + '/';
    if(this.configuration.baseUrl !== newUrl) {
      this._configuration.baseUrl = newUrl;
      this.saveConfiguration();
    }
  }

  get provisionConfigurations(): ProvisionConfiguration {
    const conf = {};
    Object.keys(this.configuration.provision || {})
      .forEach((key: string) => {
        conf[decodeURIComponent(key)] = this.configuration.provision && this.configuration.provision[key];
      });
    return conf;
  }

  get navigationUrls(): NavigationURL[] {
    return this.configuration.urls || [];
  }

  addProvisionConfiguration(name: string, config: any) {
    if(!this.configuration.provision) {
      this._configuration.provision = {};
    }
    this._configuration.provision[encodeURIComponent(name)] = Object.assign({}, config);
    this.saveConfiguration();
  }

  deleteProvisionConfiguration(name: string) {
    name = encodeURIComponent(name);
    if(this.configuration.provision && this.configuration.provision[name]) {
      delete this._configuration.provision[name];
      this.saveConfiguration();
    }
  }

  addNavigationUrl(name: string, url: string) {
    if(!this.configuration.urls) {
      this._configuration.urls = [];
    }

    const urlObj = this._configuration.urls.find((urlItem: NavigationURL) => urlItem.name === name);
    if(urlObj) {
      urlObj.value = url;
    } else {
      this._configuration.urls.push({ name, value: url });
    }
    this.saveConfiguration();
  }

  deleteNavigationUrl(name: string) {
    const index = this.navigationUrls.findIndex((url: NavigationURL) => url.name === name);
    if(index !== -1) {
      this._configuration.urls.splice(index, 1);
      this.saveConfiguration();
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
        user: new User(data && data.user)
      });
    }
    return this._configuration;
  }

  private saveConfiguration() {
    this.storage.setItem(DATA_KEY, JSON.stringify(this._configuration));
  }
}
