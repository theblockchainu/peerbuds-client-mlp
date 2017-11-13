import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdDialog } from '@angular/material';
import { AppConfig } from '../../../app.config';
import { Http, Response, } from '@angular/http';
import { SubmitEntryComponent } from '../submit-entry/submit-entry.component';
import { SubmissionViewComponent } from '../submission-view/submission-view.component';
import { ProjectSubmissionService } from '../../../_services/project-submission/project-submission.service';
import * as moment from 'moment';
import { ContentService } from '../../../_services/content/content.service';
import { VgAPI } from 'videogular2/core';
import { Ng2DeviceService } from 'ng2-device-detector';
import { Router } from '@angular/router';
import { CookieUtilsService } from '../../../_services/cookieUtils/cookie-utils.service';
import { SocketService } from '../../../_services/socket/socket.service';

@Component({
  selector: 'app-content-project',
  templateUrl: './content-project.component.html',
  styleUrls: ['./content-project.component.scss']
})
export class ContentProjectComponent implements OnInit {

  public noImage = 'assets/images/no-image.jpg';
  public defaultProfileUrl = '/assets/images/avatar.png';
  public hasPublicSubmission = false;
  public isSubmissionPossible = false;
  public publicSubmissionCount = 0;
  public attachmentUrls = [];
  api: VgAPI;
  public userId;
  public startedView;

  constructor(public config: AppConfig,
    @Inject(MD_DIALOG_DATA) public data: any,
    public dialog: MdDialog,
    public projectSubmissionService: ProjectSubmissionService,
    private contentService: ContentService,
    private deviceService: Ng2DeviceService,
    private router: Router,
    private cookieUtilsService: CookieUtilsService,
    private _socketService: SocketService
  ) {
    if (data.content.submissions !== undefined) {
        data.content.submissions.forEach(submission => {
            if (submission.isPrivate === 'false') {
                this.hasPublicSubmission = true;
                this.publicSubmissionCount++;
            }
        });
    }
    if (data.startDate !== undefined) {
      const startDateMoment = moment(data.startDate);
      this.isSubmissionPossible = moment().diff(startDateMoment) <= 0;
    }
    this.userId = cookieUtilsService.getValue('userId');
    this.data.content.supplementUrls.forEach(file => {
      this.contentService.getMediaObject(file).subscribe((res) => {
          this.attachmentUrls.push(res[0]);
      })
    });
  }

  ngOnInit() {
  }

  public onPlayerReady(api: VgAPI) {
    this.api = api;

    this.api.getDefaultMedia().subscriptions.playing.subscribe(() => {
        const view = {
            type: 'user',
            url: this.router.url,
            ip_address: '',
            browser: this.deviceService.getDeviceInfo().browser,
            viewedModelName: 'content',
            startTime: new Date(),
            content: this.data.content,
            viewer: {
                id: this.userId
            }
        };
        this._socketService.sendStartView(view);
        this._socketService.listenForViewStarted().subscribe(startedView => {
            this.startedView = startedView;
            console.log(startedView);
        });
    });

    this.api.getDefaultMedia().subscriptions.pause.subscribe(() => {
        this.startedView.viewer = {
            id: this.userId
        };
        this.startedView.endTime = new Date();
        this._socketService.sendEndView(this.startedView);
        this._socketService.listenForViewEnded().subscribe(endedView => {
            delete this.startedView;
            console.log(endedView);
        });
    });
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

  public calculateDate(fromdate, day) {
    const tempMoment = moment(fromdate);
    tempMoment.add(day, 'days');
    return tempMoment.format('ddd, MMM DD YYYY');
  }
}
