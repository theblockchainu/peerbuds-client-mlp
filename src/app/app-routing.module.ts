import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './default/default.component';
import { NoContentComponent } from './no-content/no-content.component';
import { AuthGuardService } from './_services/auth-guard/auth-guard.service';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    pathMatch: 'full'
  },
  { path: 'login',  
    component: LoginComponent 
  },
  {
    path: 'signup-social',
    loadChildren: 'app/signup-social/signup-social.module#SignupSocialModule'
  },
  {
    path: 'home',
    loadChildren: 'app/home/home.module#HomeModule'
  },
  {
    path: 'console',
    loadChildren: 'app/console/console.module#ConsoleModule'
  },
  {
    path: 'profile',
    loadChildren: 'app/profile/profile.module#ProfileModule'
  },
  {
    path: 'experience',
    loadChildren: 'app/experience-wizard/experience-wizard.module#ExperienceWizardModule'
  },
  {
    path: 'workshop',
    loadChildren: 'app/workshop/workshop.module#WorkshopModule'
  },
  {
    path: 'identity-verification',
    loadChildren: 'app/verification/verification.module#VerificationModule'
  },
  {
    path: 'onboarding',
    loadChildren: 'app/onboarding/onboarding.module#OnboardingModule'
  },
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule'
  }
  ,
  {
    path: '**',
    component: NoContentComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
