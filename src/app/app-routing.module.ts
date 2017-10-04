import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent } from './default/index/index.component';
import { IndexComponent1 } from './default/index1/index1.component';
import { NoContentComponent } from './no-content/no-content.component';
import { AuthGuardService } from './_services/auth-guard/auth-guard.service';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { LoginComponentDialog } from './_services/dialogs/login-dialog/login-dialog.component';
import { LoginComponent } from './login/login.component';
import { AppDesignComponent } from "./app-design/app-design.component";
import { IndexPhilComponent } from './default/index-philosophy/index-philosophy.component';
import { GlobalErrorHandler } from './error-handler/globalerrorhandler';
import { DialogsService } from './_services/dialogs/dialog.service';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    pathMatch: 'full'
  },
  {
    path: 'philosophy',
    component: IndexPhilComponent
  }, 
  {
    path: 'design',
    component: AppDesignComponent
  },
  {
    path: 'login',
    component: IndexComponent1
  },
  {
    path: 'login1',
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
    path: 'app-upload-docs',
    loadChildren: 'app/verification/verification.module#VerificationModule'
  },
  {
    path: 'onboarding',
    loadChildren: 'app/onboarding/onboarding.module#OnboardingModule'
  },
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule'
  },
  {
    path: 'review-pay',
    loadChildren: 'app/review-pay/review-pay.module#ReviewPayModule'
  }
  ,
  {
    path: 'access-denied',
    component: AccessDeniedComponent
  }
  ,
  {
    path: 'error',
    component: GlobalErrorHandler
  },
  {
    path: '**',
    component: NoContentComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [LoginComponentDialog]
})
export class AppRoutingModule { }
