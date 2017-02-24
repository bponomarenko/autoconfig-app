import { Routes, RouterModule } from '@angular/router';

import { LogsComponent } from './logs.component';

const ROUTES: Routes = [
  { path: '', component: LogsComponent, pathMatch: 'full' },
  { path: ':name', component: LogsComponent }
];

export const RoutingModule = RouterModule.forChild(ROUTES);
