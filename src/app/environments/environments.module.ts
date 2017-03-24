import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TooltipModule, CollapseModule } from 'ng2-bootstrap';

import { SharedModule } from '../shared/shared.module';
import { ExpiresPipe } from './pipes/expires.pipe';
import { EnvironmentsComponent } from './environments.component';
import { HeaderComponent } from './header/header.component';
import { CreateFormComponent } from './create-form/create-form.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { StatusComponent } from './status/status.component';
import { FilteringService } from './filtering.service';
import { FiltersBarComponent } from './filters-bar/filters-bar.component';
import { StatusPipe } from './pipes/status.pipe';
import { VersionedPropertyPipe } from './pipes/versioned-property.pipe';
import { EnvironmentComponent } from './environment/environment.component';

@NgModule({
  declarations: [
    ExpiresPipe,
    EnvironmentsComponent,
    HeaderComponent,
    CreateFormComponent,
    CheckboxComponent,
    StatusComponent,
    FiltersBarComponent,
    StatusPipe,
    VersionedPropertyPipe,
    EnvironmentComponent
  ],
  imports: [
    TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    SharedModule,
    RouterModule
  ],
  providers: [FilteringService, StatusPipe]
})
export class EnvironmentsModule {}
