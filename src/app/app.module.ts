import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ModalModule, TooltipModule, DropdownModule, AlertModule } from 'ng2-bootstrap';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppComponent } from './app.component';
import { ConfigurationService, EnvironmentsService, NotificationsService,
  InMemoryEnvironmentsService } from './services';
import { EnvironmentsHeaderComponent, ModalComponent, UserFormComponent, LoaderComponent,
  IconDirective, EnvironmentsComponent, CredentialsModalComponent, NotificationsComponent,
  CreateFormComponent, LogsComponent } from './components';
import { ExpiresPipe } from './pipes/expires.pipe';
import { DecodePipe } from './pipes/decode.pipe';
import { RoutingModule } from './app.routing';

import { environment as env} from '../environments/environment';

const moduleConfiguration = {
  declarations: [
    AppComponent,
    EnvironmentsHeaderComponent,
    ModalComponent,
    UserFormComponent,
    LoaderComponent,
    IconDirective,
    EnvironmentsComponent,
    ExpiresPipe,
    CredentialsModalComponent,
    NotificationsComponent,
    CreateFormComponent,
    DecodePipe,
    LogsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    DropdownModule.forRoot(),
    AlertModule.forRoot(),
    RoutingModule
  ],
  providers: [ConfigurationService, EnvironmentsService, NotificationsService],
  bootstrap: [AppComponent],
  exports: [IconDirective]
};

if (env.mocks) {
  // Add mocking 'in-memory' service
  moduleConfiguration.imports.push(InMemoryWebApiModule.forRoot(InMemoryEnvironmentsService));
}

@NgModule(moduleConfiguration)
export class AppModule { }
