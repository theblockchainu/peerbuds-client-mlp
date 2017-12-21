import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import 'hammerjs';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './_core/_core.module';
import { AppComponent } from './app.component';
import { DefaultComponent } from './default/default.component';
import { NoContentComponent } from './no-content/no-content.component';
import { LoginComponent } from './login/login.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdButtonModule, MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule, MdAutocompleteModule, MdInputModule, MdNativeDateModule, MdProgressSpinnerModule, MdProgressBarModule, MdTooltipModule } from '@angular/material';
import { DialogsModule } from './_services/dialogs/dialogs.module';
import { GlobalErrorHandler } from './error-handler/globalerrorhandler';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { SignupComponent } from './signup/signup.component';
import { AppDesignComponent } from './app-design/app-design.component';
import { AppNotificationDialogComponent } from './app-header/dialogs/app-notification-dialog/app-notification-dialog.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ContactComponent } from './contact-us/contact-us.component';
import { ANIMATION_TYPES, LoadingModule } from 'ngx-loading';
import { AboutUsComponent } from './about-us/about-us.component';
import { WhitePaperComponent } from './white-paper/white-paper.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { DefaultModule } from './default/default.module';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    NoContentComponent,
    AppHeaderComponent,
    AppFooterComponent,
    AccessDeniedComponent,
    LoginComponent,
    SignupComponent,
    AppDesignComponent,
    GlobalErrorHandler,
    AppNotificationDialogComponent,
    ResetPasswordComponent,
    ContactComponent,
    AboutUsComponent,
    WhitePaperComponent,
    PrivacyPolicyComponent,
    TermsOfServiceComponent],
  imports: [
    BrowserModule,
    CoreModule,
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
    MdTooltipModule,
    DialogsModule,
    AppRoutingModule,
    DefaultModule,
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.threeBounce,
      backdropBackgroundColour: 'rgba(0,0,0,0)',
      backdropBorderRadius: '0px',
      primaryColour: '#33bd9e',
      secondaryColour: '#ff5b5f',
      tertiaryColour: '#ff6d71'
    })
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    Title
  ],
  entryComponents: [AppNotificationDialogComponent]
})
export class AppModule { }
