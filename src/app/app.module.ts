import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './_core/_core.module';

import { ExperienceWizardModule } from './experience-wizard/experience-wizard.module';

import { AppComponent } from './app.component';
import { DefaultComponent } from './default/default.component';
import { NoContentComponent } from './no-content/no-content.component';
import { LoginComponent } from './login/login.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdButtonModule, MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule, MdAutocompleteModule, MdInputModule, MdNativeDateModule, MdProgressSpinnerModule, MdProgressBarModule } from '@angular/material';


import 'hammerjs';

import { DialogsModule } from './_services/dialogs/dialogs.module';
import {GlobalErrorHandler} from './error-handler/globalerrorhandler';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import {SignupComponent} from './signup/signup.component';
import { AppDesignComponent } from './app-design/app-design.component';

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    NoContentComponent,
    LoginComponent,
    AppHeaderComponent,
    AppFooterComponent,
    AccessDeniedComponent,
    SignupComponent,
    AppDesignComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    ExperienceWizardModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MdCardModule,
    MdButtonModule,
    MdMenuModule,
    MdToolbarModule,
    MdIconModule,
    MdAutocompleteModule,
    MdInputModule,
    MdNativeDateModule,
    MdProgressSpinnerModule,
    MdProgressBarModule,
    DialogsModule
  ],
  bootstrap: [AppComponent],
  providers: [
      {
        provide: ErrorHandler,
        useClass: GlobalErrorHandler
      }
  ]
})
export class AppModule {}
