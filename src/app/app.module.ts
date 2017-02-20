import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ModalModule, TooltipModule, DropdownModule, AlertModule } from 'ng2-bootstrap';

import { AppComponent } from './app.component';
import { ConfigurationService, EnvironmentsService, NotificationsService } from './services';
import { HeaderComponent, ModalComponent, UserFormComponent, LoaderComponent,
  IconDirective, EnvironmentsComponent, CredentialsModalComponent, NotificationsComponent,
  CreateFormComponent } from './components';
import { ExpiresPipe } from './pipes/expires.pipe';
import { DecodePipe } from './pipes/decode.pipe';

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
    CreateFormComponent,
    DecodePipe
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
    ConfigurationService,
    EnvironmentsService,
    NotificationsService
  ],
  bootstrap: [AppComponent],
  exports: [IconDirective]
})
export class AppModule { }
