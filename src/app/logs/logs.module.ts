import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { RoutingModule } from './logs.routing';
import { LogsComponent } from './logs.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [LogsComponent, HeaderComponent],
  imports: [SharedModule, RoutingModule]
})
export class LogsModule {}
