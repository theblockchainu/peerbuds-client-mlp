import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { AppConfig } from './app.config';

import { AppComponent } from './app.component';
import { DefaultComponent } from './default/default.component';
import { NoContentComponent } from './no-content/no-content.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
// import { ExperienceOnboardingComponent } from './experience-wizard/experience-wizard.component';
import { ExperienceWizardModule } from "./experience-wizard/experience-wizard.module";
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppFooterComponent } from './app-footer/app-footer.component';

import { AlertService } from './_services/alert/alert.service';
import { AuthenticationService } from './_services/authentication/authentication.service';
import { AuthGuardService } from './_services/auth-guard/auth-guard.service';
import { AuthService } from './_services/auth/auth.service';

import { CollectionService } from './_services/collection/collection.service';
import { WorkshopWizardRoutingModule } from './workshop-wizard/workshop-wizard-routing.module';
import { WorkshopWizardModule } from "./workshop-wizard/workshop-wizard.module";
import { HomeModule } from "./home/home.module";

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    NoContentComponent,
    LoginComponent,
    AppHeaderComponent,
    AppFooterComponent,
    SignupComponent,
    OnboardingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    WorkshopWizardRoutingModule,
    WorkshopWizardModule,
    HomeModule,
    ExperienceWizardModule
  ],
  providers: [
    AppConfig,
    CookieService,
    AlertService,
    AuthenticationService,
    CollectionService,
    AuthGuardService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
