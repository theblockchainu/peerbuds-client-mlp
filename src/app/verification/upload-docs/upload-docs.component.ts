import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Http } from '@angular/http';
import { AppConfig } from '../../app.config';

@Component({
  selector: 'app-upload-docs',
  templateUrl: './upload-docs.component.html',
  styleUrls: ['./upload-docs.component.scss']
})
export class UploadDocsComponent implements OnInit {

  public step = 1;
  constructor() { }

  ngOnInit() {
  }

  continue(p){
    this.step = p;
  }
  verifyEmail(){
    alert("Email verifciation.");
  }

}
