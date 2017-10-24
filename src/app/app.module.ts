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
import { IndexComponent1 } from './default/index1/index1.component';
import { IndexPhilComponent } from './default/index-philosophy/index-philosophy.component';
import 'hammerjs';
import { DialogsModule } from './_services/dialogs/dialogs.module';
import { GlobalErrorHandler } from './error-handler/globalerrorhandler';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { SignupComponent } from './signup/signup.component';
import { AppDesignComponent } from './app-design/app-design.component';
import { AppNotificationDialogComponent } from './app-header/dialogs/app-notification-dialog/app-notification-dialog.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
//import { Ng2CarouselamosModule } from 'ng2-carouselamos';
import { ContactComponent } from './default/contact/contact.component';
import { AgmCoreModule } from '@agm/core';
//import {CSSCarouselComponent} from './default/carousal/carousal.component';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import {ANIMATION_TYPES, LoadingModule} from 'ngx-loading';


@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    NoContentComponent,
    AppHeaderComponent,
    AppFooterComponent,
    IndexComponent,
    IndexComponent1,
    IndexPhilComponent,
    AccessDeniedComponent,
    LoginComponent,
    SignupComponent,
    AppDesignComponent,
    GlobalErrorHandler,
    AppNotificationDialogComponent,
    ResetPasswordComponent,
    ContactComponent
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
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCRlu1idtqJsswvD8ntec8mmYN8kSumZkM' }),
    Ng4GeoautocompleteModule.forRoot(),
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
    }
  ],
  entryComponents: [AppNotificationDialogComponent]
})
export class AppModule { }
