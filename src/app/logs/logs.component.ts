import { Component, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { EnvironmentsService, ConfigurationService, NotificationsService, SessionService } from '../services';
import { CredentialsModalComponent } from '../shared/credentials-modal/credentials-modal.component';
import { User } from '../types';

// Page size in character number
const PAGE_SIZE = 5000;

@Component({
  selector: 'ac-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements AfterViewInit, OnDestroy {
  private routeSubscription: Subscription;
  private envName: string;
  private loadingLogs: boolean = false;
  private errorId: number;
  private fullLog: string = '';
  private log: string = '';
  private page: number = 0;

  @ViewChild('userDialog') userDialog: CredentialsModalComponent;

  constructor(
    private route: ActivatedRoute,
    private envService: EnvironmentsService,
    private confService: ConfigurationService,
    private alerts: NotificationsService,
    private session: SessionService) {

    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      this.envName = params['name'] || this.session.logsEnvironmentName;
    });
  }

  ngAfterViewInit() {
    if(this.envName) {
      this.loadLogs();
    }
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.dismissError();
  }

  private get hasMore(): boolean {
    return this.fullLog.length !== this.log.length;
  }

  private loadLogs(user?: User): void {
    if(this.loadingLogs) {
      return;
    }

    if((!user || !user.hasAllData()) && (!this.confService.user || !this.confService.user.hasAllData())) {
      this.showCredentialsDialog();
      return;
    }

    this.dismissError();
    this.loadingLogs = true;
    this.fullLog = this.log = '';
    this.page = 0;

    this.envService.loadEnvironmentLogs({
        user: user || this.confService.user,
        environmentName: this.envName
      })
      .then(log => {
        this.fullLog = log;
        this.updateLog(this.page);

        this.userDialog.hide();
        this.loadingLogs = false;

        // Store environment name to the session
        this.session.logsEnvironmentName = this.envName;
      })
      .catch(error => {
        this.errorId = this.alerts.addError(`Unable to load ${this.envName} logs. ${error.message || error}`);
        this.loadingLogs = false;

        // Remove environment name from session if error
        this.session.logsEnvironmentName = null;
      });
  }

  private dismissError() {
    if (this.errorId) {
      this.alerts.dismiss(this.errorId);
      this.errorId = null;
    }
  }

  private showCredentialsDialog() {
    this.userDialog.show();
  }

  private updateLog(page: number) {
    // Simple "load more" functionality from local cache
    this.log += this.fullLog.substr(page * PAGE_SIZE, PAGE_SIZE);
  }

  private nextPage() {
    this.updateLog(++this.page);
  }
}
