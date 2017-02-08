import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ModalModule } from 'ng2-bootstrap/modal';
import { AlertModule } from 'ng2-bootstrap/alert';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoaderComponent } from './loader/loader.component';

import { UserService } from './services/user.service';
import { EnvironmentsService } from './services/environments.service';
// Uncomment next line to use static mock data
// import { InMemoryEnvironmentsService }  from './services/in-memory.environments.service';
import { NotificationsService } from './services/notifications.service';
import { IconDirective } from './icon/icon.directive';
import { CredentialsFormComponent } from './credentials-form/credentials-form.component';
import { EnvironmentsComponent } from './environments/environments.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProvisionDialogComponent } from './provision-dialog/provision-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoaderComponent,
    IconDirective,
    CredentialsFormComponent,
    EnvironmentsComponent,
    NotificationsComponent,
    ProvisionDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    // Uncomment next line to use static mock data
    // InMemoryWebApiModule.forRoot(InMemoryEnvironmentsService),
    ModalModule.forRoot(),
    AlertModule.forRoot()
  ],
  providers: [
    EnvironmentsService,
    UserService,
    NotificationsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule{
}
