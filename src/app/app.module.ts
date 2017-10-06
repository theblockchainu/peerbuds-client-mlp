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

import { IndexComponent } from './default/index/index.component';
import { IndexPhilComponent } from './default/index-philosophy/index-philosophy.component';

import 'hammerjs';

import { DialogsModule } from './_services/dialogs/dialogs.module';
import { GlobalErrorHandler } from './error-handler/globalerrorhandler';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { SignupComponent } from './signup/signup.component';
import { AppDesignComponent } from './app-design/app-design.component';
import { AppNotificationDialogComponent } from './app-header/dialogs/app-notification-dialog/app-notification-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    NoContentComponent,
    AppHeaderComponent,
    AppFooterComponent,
    IndexComponent,
    IndexPhilComponent,
    AccessDeniedComponent,
    LoginComponent,
    SignupComponent,
    AppDesignComponent,
    AppNotificationDialogComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    ExperienceWizardModule,
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
    DialogsModule,
    AppRoutingModule,
  ],
  bootstrap: [AppComponent],
  providers: [
      {
        provide: ErrorHandler,
        useClass: GlobalErrorHandler
      }
  ],
  entryComponents: [AppNotificationDialogComponent]
})
export class AppModule {}
