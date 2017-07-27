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
import { ExperienceOnboardingComponent } from './experience-wizard/experience-wizard.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppFooterComponent } from './app-footer/app-footer.component';

import { AlertService } from './_services/alert/alert.service';
import { AuthenticationService } from './_services/authentication/authentication.service';

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    NoContentComponent,
    LoginComponent,
    AppHeaderComponent,
    AppFooterComponent,
    SignupComponent,
    OnboardingComponent,
    ExperienceOnboardingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    AppConfig,
    CookieService,
    AlertService,
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
