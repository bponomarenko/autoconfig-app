import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'ng2-bootstrap';

import { SharedModule } from '../shared/shared.module';
import { ExpiresPipe } from './pipes/expires.pipe';
import { EnvironmentsComponent } from './environments.component';
import { HeaderComponent } from './header/header.component';
import { CreateFormComponent } from './create-form/create-form.component';

@NgModule({
  declarations: [
    ExpiresPipe,
    EnvironmentsComponent,
    HeaderComponent,
    CreateFormComponent
  ],
  imports: [TooltipModule.forRoot(), SharedModule, RouterModule],
})
export class EnvironmentsModule {}
