import { Routes, RouterModule } from '@angular/router';

import { EnvironmentsComponent } from './environments/environments.component';

const ROUTES: Routes = [
  { path: '', component: EnvironmentsComponent, pathMatch: 'full' },
  { path: 'logs', loadChildren: 'app/logs/logs.module#LogsModule' }
];

export const RoutingModule = RouterModule.forRoot(ROUTES);
