import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule, DropdownModule } from 'ng2-bootstrap';

import { IconDirective } from './icon/icon.directive';
import { UserFormComponent } from './user-form/user-form.component';
import { ModalComponent } from './modal/modal.component';
import { CredentialsModalComponent } from './credentials-modal/credentials-modal.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    IconDirective,
    UserFormComponent,
    ModalComponent,
    CredentialsModalComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    DropdownModule.forRoot()
  ],
  exports: [
    CommonModule,
    FormsModule,
    DropdownModule,

    IconDirective,
    UserFormComponent,
    ModalComponent,
    CredentialsModalComponent,
    LoaderComponent
  ]
})
export class SharedModule {}
