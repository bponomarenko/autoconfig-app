import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AlertModule } from 'ng2-bootstrap';

import { SharedModule } from './shared/shared.module';
import { EnvironmentsModule } from './environments/environments.module';
import { AppComponent } from './app.component';
import { ConfigurationService, EnvironmentsService, NotificationsService, InMemoryEnvironmentsService } from './services';
import { NotificationsComponent } from './notifications/notifications.component';
import { RoutingModule } from './app.routing';
import { environment as env} from '../environments/environment';

const CONFIGURATION = {
  declarations: [AppComponent, NotificationsComponent],
  imports: [
    BrowserModule,
    HttpModule,
    SharedModule,
    EnvironmentsModule,
    AlertModule.forRoot(),
    RoutingModule
  ],
  providers: [ConfigurationService, EnvironmentsService, NotificationsService],
  bootstrap: [AppComponent]
};

if (env.mocks) {
  // Add mocking 'in-memory' service
  CONFIGURATION.imports.push(InMemoryWebApiModule.forRoot(InMemoryEnvironmentsService));
}

@NgModule(CONFIGURATION)
export class AppModule {}
