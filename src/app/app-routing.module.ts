import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './default/default.component';
import { NoContentComponent } from './no-content/no-content.component';
import { AuthGuardService } from './_services/auth-guard/auth-guard.service';
import { HomeModule } from './home/home.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { OnboardingComponent } from './onboarding/onboarding.component';

const routes: Routes = [
// Default landing page for peerbuds.com
{
  path: '',
  component: DefaultComponent,
  pathMatch: 'full'
},
// Signup Local page
{ path: 'signup', component: SignupComponent },
// Login Page
{ path: 'login',  component: LoginComponent },
// Learner Onboarding
{ path: 'onboarding', component: OnboardingComponent },
// Page for No Content
{ path: '**', component: NoContentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
