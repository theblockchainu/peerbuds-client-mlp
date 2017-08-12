import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './default/default.component';
import { NoContentComponent } from './no-content/no-content.component';
import { AuthGuardService } from './_services/auth-guard/auth-guard.service';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'login',  component: LoginComponent },
  {
    path: '',
    component: DefaultComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
