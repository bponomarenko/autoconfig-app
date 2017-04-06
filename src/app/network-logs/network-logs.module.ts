import { NgModule } from '@angular/core';

import { SharedModule } from "app/shared/shared.module";
import { NetworkLogsComponent } from './network-logs.component';
import { NetworkLogsRoutingModule } from './network-logs-routing.module';

@NgModule({
  imports: [
    SharedModule,
    NetworkLogsRoutingModule
  ],
  declarations: [NetworkLogsComponent]
})
export class NetworkLogsModule { }
