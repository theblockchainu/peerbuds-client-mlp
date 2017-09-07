import { Component, OnInit } from '@angular/core';
import { MdDialogRef, MdDialog, MdDialogConfig, MdIconModule, MD_DIALOG_DATA } from '@angular/material';
import {
  FormGroup, FormArray, FormBuilder, FormControl, AbstractControl, Validators
} from '@angular/forms';
import { ContentService } from '../../../_services/content/content.service';

@Component({
  selector: 'app-add-topic-dialog',
  templateUrl: './add-topic-dialog.component.html',
  styleUrls: ['./add-topic-dialog.component.scss']
})
export class AddTopicDialogComponent implements OnInit {
  public newTopic: FormGroup;

  constructor(public dialogRef: MdDialogRef<AddTopicDialogComponent>,
              public _contentService: ContentService,
              private _fb: FormBuilder) { }

  ngOnInit() {
    this.newTopic = this._fb.group({
      topicName: ['', Validators.requiredTrue]
    });
  }

  addNewTopic() {
    this._contentService.addNewTopic(this.newTopic.controls['topicName'].value)
        .map((res) => {
          this.dialogRef.close({res});
        })
        .subscribe();
  }

}
