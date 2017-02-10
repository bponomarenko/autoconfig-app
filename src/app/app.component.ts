import { Component, OnInit } from '@angular/core';

import { EnvironmentsService } from './services/environments.service';
import { NotificationsService } from './services/notifications.service';
import { Environment } from './types/environment';

@Component({
  selector: 'ac-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private loading: boolean = false;
  private environments: Environment[] = null;
  private loadErrorId: number;

  constructor(private envService: EnvironmentsService, private notifications: NotificationsService) {
    this.load();

    this.envService.onValidationError.subscribe((errors: string[]) => {
      this.notifications.addWarning('Information may be displayed incorrectly because data format changed. Check browser console for details.');
      errors.forEach(error => { console.warn(error) });

      // Validation error should be shown just once
      this.envService.onValidationError.unsubscribe();
    });
  }

  ngOnInit() {
    // Trick to enable Bootstrap4 support in ng2-bootstrap library
    (<any>window).__theme = 'bs4';
  }

  load() {
    if(this.loading) {
      return;
    }

    if(this.loadErrorId) {
      this.notifications.dismiss(this.loadErrorId);
      this.loadErrorId = null;
    }

    this.loading = true;
    this.environments = null;

    this.envService.getAll()
      .then((data: Environment[]) => {
        this.environments = data.splice(0);
      })
      .catch(error => {
        this.loadErrorId = this.notifications.addError(`Unable to load environments. ${error.message}`);
      })
      .then(() => {
        this.loading = false;
      });
  }

  onEnvironmentRemoved(name: string) {
    this.environments = this.environments.filter((env: Environment) => env.name !== name);
  }
}
