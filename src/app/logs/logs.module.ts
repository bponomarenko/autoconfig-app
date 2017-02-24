import { NgModule } from '@angular/core';

import { LogsComponent } from './logs.component';
import { RoutingModule } from './logs.routing';

@NgModule({
  declarations: [LogsComponent],
  imports: [RoutingModule]
})
export class LogsModule {}
