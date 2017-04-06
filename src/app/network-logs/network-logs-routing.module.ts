import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NetworkLogsComponent } from "app/network-logs/network-logs.component";

const routes: Routes = [
  { path: '', component: NetworkLogsComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class NetworkLogsRoutingModule { }
