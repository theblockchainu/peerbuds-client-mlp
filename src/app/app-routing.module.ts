import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './default/default.component';
import { NoContentComponent } from './no-content/no-content.component';
import { AuthGuardService } from './_services/auth-guard/auth-guard.service';
import { LoginComponent } from './login/login.component';
import { SignupSocialComponent} from './signup-social/signup-social.component';

const routes: Routes = [
  { path: 'login',  component: LoginComponent },
  {
    path: '',
    component: DefaultComponent,
    pathMatch: 'full'
  },
  {
    path: 'signup-social',
    component: SignupSocialComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
