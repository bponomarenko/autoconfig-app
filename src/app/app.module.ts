import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ModalModule, TooltipModule, DropdownModule, AlertModule } from 'ng2-bootstrap';

import { AppComponent } from './app.component';
import { UserService, EnvironmentsService, NotificationsService } from './services';
import { HeaderComponent, ModalComponent, UserFormComponent, LoaderComponent,
  IconDirective, EnvironmentsComponent, CredentialsModalComponent, NotificationsComponent,
  CreateFormComponent } from './components';
import { ExpiresPipe } from './pipes/expires.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ModalComponent,
    UserFormComponent,
    LoaderComponent,
    IconDirective,
    EnvironmentsComponent,
    ExpiresPipe,
    CredentialsModalComponent,
    NotificationsComponent,
    CreateFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    DropdownModule.forRoot(),
    AlertModule.forRoot()
  ],
  providers: [
    UserService,
    EnvironmentsService,
    NotificationsService
  ],
  bootstrap: [AppComponent],
  exports: [IconDirective]
})
export class AppModule { }
