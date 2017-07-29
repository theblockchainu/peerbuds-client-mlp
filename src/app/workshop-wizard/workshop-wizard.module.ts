import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgModel, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageUploadModule } from 'angular2-image-upload';
import { ModalModule, RatingModule, BsDropdownModule, ProgressbarModule, TabsModule } from 'ngx-bootstrap';

import { AuthenticationService } from "../_services/authentication/authentication.service";
import { CountryPickerService } from "../_services/countrypicker/countrypicker.service";
import { LanguagePickerService } from "../_services/languagepicker/languagepicker.service";
// import { AuthGuardService } from '../_services/auth-guard/auth-guard.service';

import { WorkshopWizardRoutingModule } from './workshop-wizard-routing.module';
import { CreateWorkshopComponent } from './create-workshop/create-workshop.component';
import { WorkshopContentComponent } from './workshop-content/workshop-content.component';
import { ContentViewComponent } from './content-view/content-view.component';
import { ListWorkshopComponent } from './list-workshop/list-workshop.component';


//import { MultiselectAutocompleteModule } from './utilityComponents/multiselect-autocomplete/module';

import { FileUploadModule } from 'primeng/primeng';



@NgModule({
  imports: [
    CommonModule,
    WorkshopWizardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ImageUploadModule.forRoot(),
    ProgressbarModule.forRoot(),
    ModalModule.forRoot(),
    RatingModule.forRoot(),
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    FileUploadModule
  ],
  declarations: [CreateWorkshopComponent, WorkshopContentComponent, ContentViewComponent, ListWorkshopComponent],
  providers: [
    AuthenticationService,
    CountryPickerService,
    LanguagePickerService // ,
    // AuthGuardService
  ]
})
export class WorkshopWizardModule { }
