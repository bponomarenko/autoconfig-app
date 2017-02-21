import { Routes, RouterModule } from '@angular/router';
import { EnvironmentsComponent, LogsComponent } from './components';

const ROUTES: Routes = [
  { path: '', component: EnvironmentsComponent, pathMatch: 'full' },
  { path: 'logs', children: [
    { path: '', component: LogsComponent, pathMatch: 'full' },
    { path: ':name', component: LogsComponent }
  ] }
];

export const RoutingModule =  RouterModule.forRoot(ROUTES);
