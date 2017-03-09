import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ConfigurationService, NotificationsService } from '../services';
import { User, UserFormData } from '../types';
import { UserFormComponent } from '../shared/user-form/user-form.component';

interface UrlFormData {
  urlName: string;
  navigationUrl: string;
}

@Component({
  selector: 'ac-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  private userData: UserFormData;
  private settingsAlertId: number;

  @ViewChild('userForm') userForm: UserFormComponent;
  @ViewChild('urlForm') urlForm: NgForm;
  @ViewChild('baseUrlForm') baseUrlForm: NgForm;

  constructor(private configuration: ConfigurationService, private alerts: NotificationsService) {
  }

  ngOnInit() {
    this.userData = { user: new User(this.configuration.user) };
  }

  ngOnDestroy() {
    if(this.settingsAlertId) {
      this.alerts.dismiss(this.settingsAlertId);
    }
  }

  private get configurations(): string[] {
    return Object.keys(this.configuration.provisionConfigurations);
  }

  private get urls() {
    return this.configuration.navigationUrls;
  }

  private get initialBaseUrl(): string {
    return this.configuration.baseUrl;
  }

  private saveBaseURL(url: string) {
    this.configuration.baseUrl = url;
    this.baseUrlForm.reset();
    this.settingsAlertId = this.alerts.addSuccess('Base API URL was saved.');
  }

  private saveUser() {
    this.configuration.user = this.userData.user;
    this.settingsAlertId = this.alerts.addSuccess('User credentials was saved.');
    this.userForm.reset({ user: this.configuration.user });
  }

  private deleteConfiguration(name: string) {
    this.configuration.deleteProvisionConfiguration(name);
    this.settingsAlertId = this.alerts.addSuccess(`Provisioning configuration "${name}" was deleted.`);
  }

  private addURL(value: UrlFormData) {
    this.configuration.addNavigationUrl(value.urlName, value.navigationUrl);
    this.settingsAlertId = this.alerts.addSuccess(`Navigation URL "${value.urlName}" was added.`);
    this.urlForm.reset();
  }

  private deleteURL(name: string) {
    this.configuration.deleteNavigationUrl(name);
    this.settingsAlertId = this.alerts.addSuccess(`Navigation URL "${name}" was deleted.`);
  }
}
