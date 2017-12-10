import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from '@angular/material';
import {AppConfig} from '../../../app.config';
import {CollectionService} from '../../../_services/collection/collection.service';
import {ProjectSubmissionService} from '../../../_services/project-submission/project-submission.service';
import {SubmissionViewComponent} from '../submission-view/submission-view.component';

@Component({
  selector: 'app-view-entry-dialog',
  templateUrl: './view-entry-dialog.component.html',
  styleUrls: ['./view-entry-dialog.component.scss']
})
export class ViewEntryDialogComponent implements OnInit {

    public noImage = 'assets/images/no-image.jpg';
    public defaultProfileUrl = '/assets/images/avatar.png';

    constructor(
        public dialogRef: MdDialogRef<ViewEntryDialogComponent>,
        @Inject(MD_DIALOG_DATA) public data: any,
        public config: AppConfig,
        private dialog: MdDialog,
        private _collectionService: CollectionService,
        private _projectSubmissionService: ProjectSubmissionService
    ) { }

    ngOnInit() {

    }

    imgErrorHandler(event) {
        event.target.src = '/assets/images/placeholder-image.jpg';
    }

    public viewSubmission(submissionId) {
        const query = '{"include":[{"upvotes":"peer"}, {"peer": "profiles"}, {"comments": [{"peer": {"profiles": "work"}}, {"replies": [{"peer": {"profiles": "work"}}]}]}]}';
        this._projectSubmissionService.viewSubmission(submissionId, query).subscribe((response) => {
            if (response) {
                const dialogRef = this.dialog.open(SubmissionViewComponent, {
                    data: {
                        userType: this.data.userType,
                        submission: response.json(),
                        peerHasSubmission: this.data.peerHasSubmission,
                        collectionId: this.data.collectionId
                    },
                    width: '45vw'
                });
            }
        });
    }

}
