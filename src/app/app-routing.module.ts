import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './default/index/index.component';
import { NoContentComponent } from './no-content/no-content.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { LoginComponentDialog } from './_services/dialogs/login-dialog/login-dialog.component';
import { LoginComponent } from './login/login.component';
import { AppDesignComponent } from './app-design/app-design.component';
import { IndexPhilComponent } from './default/index-philosophy/index-philosophy.component';
import { GlobalErrorHandler } from './error-handler/globalerrorhandler';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ContactComponent } from './contact-us/contact-us.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { WhitePaperComponent } from './white-paper/white-paper.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    pathMatch: 'full'
  },
  {
    path: 'about-us',
    component: AboutUsComponent
  },
  {
    path: 'white-paper',
    component: WhitePaperComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'terms-of-service',
    component: TermsOfServiceComponent
  },
  {
    path: 'philosophy',
    component: IndexPhilComponent
  },
  {
    path: 'contact-us',
    component: ContactComponent
  },
  {
    path: 'design',
    component: AppDesignComponent
  },
  {
    path: 'login',
    component: IndexComponent
  },
  {
    path: 'reset',
    component: ResetPasswordComponent
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
    loadChildren: 'app/experience/experience.module#ExperienceModule'
  },
  {
    path: 'workshop',
    loadChildren: 'app/workshop/workshop.module#WorkshopModule'
  },
  {
      path: 'community',
      loadChildren: 'app/community/community.module#CommunityModule'
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
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent
  },
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
