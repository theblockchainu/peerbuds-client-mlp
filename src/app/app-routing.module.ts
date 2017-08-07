import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './default/default.component';
import { NoContentComponent } from './no-content/no-content.component';
import { AuthGuardService } from './_services/auth-guard/auth-guard.service';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
// Default landing page for peerbuds.com
{
  path: '',
  component: DefaultComponent,
  pathMatch: 'full'
},
// Login Page
{ path: 'login',  component: LoginComponent },
// Page for No Content
// { path: '**', component: NoContentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
