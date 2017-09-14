import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdDialog } from '@angular/material';
import { AppConfig } from '../../../app.config';
import { Http, Response, } from '@angular/http';
import { SubmitEntryComponent } from '../submit-entry/submit-entry.component';
import { SubmissionViewComponent } from '../submission-view/submission-view.component';
import { ProjectSubmissionService } from '../../../_services/project-submission/project-submission.service';
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  selector: 'app-content-project',
  templateUrl: './content-project.component.html',
  styleUrls: ['./content-project.component.scss']
})
export class ContentProjectComponent implements OnInit {

  public noImage = 'assets/images/no-image.jpg';
  public defaultProfileUrl = '/assets/images/avatar.png';
  public hasPublicSubmission = false;
  public publicSubmissionCount = 0;

  constructor(public config: AppConfig,
    @Inject(MD_DIALOG_DATA) public data: any,
    public dialog: MdDialog,
    public projectSubmissionService: ProjectSubmissionService
  ) {
    data.content.submissions.forEach(submission => {
      if (submission.isPrivate === 'false') {
        this.hasPublicSubmission = true;
        this.publicSubmissionCount++;
      }
    });
  }
  ngOnInit() {
  }

  openSubmitEntryDialog(data: any) {
    const dialogRef = this.dialog.open(SubmitEntryComponent, {
      data: data,
      width: '50vw',
      height: '90vh'
    });
  }

  public viewSubmission(submissionId) {
    const query = '{"include":[{"upvotes":"peer"}, {"peer": "profiles"}, {"comments": [{"peer": {"profiles": "work"}}, {"replies": [{"peer": {"profiles": "work"}}]}]}]}';
    this.projectSubmissionService.viewSubmission(submissionId, query).subscribe((response: Response) => {
      if (response) {
        const dialogRef = this.dialog.open(SubmissionViewComponent, {
          data: {
            userType: this.data.userType,
            submission: response.json(),
            peerHasSubmission: this.data.peerHasSubmission,
            collectionId: this.data.collectionId
          },
          width: '50vw',
          height: '90vh'
        });
      }
    });
  }
}
