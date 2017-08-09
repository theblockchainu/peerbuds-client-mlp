import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './_core/_core.module';

import { ExperienceWizardModule } from './experience-wizard/experience-wizard.module';
import { WorkshopModule } from './workshop/workshop.module';
import { HomeModule } from './home/home.module';
import { VerificationModule } from './verification/verification.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { ProfileModule } from './profile/profile.module';

import { AppComponent } from './app.component';
import { DefaultComponent } from './default/default.component';
import { NoContentComponent } from './no-content/no-content.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppFooterComponent } from './app-footer/app-footer.component';


@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    NoContentComponent,
    LoginComponent,
    AppHeaderComponent,
    AppFooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    HomeModule,
    WorkshopModule,
    ExperienceWizardModule,
    OnboardingModule,
    VerificationModule,
    ProfileModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
