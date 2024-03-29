import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { AppConfig } from '../../../app.config';
import { CollectionService } from '../../../_services/collection/collection.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from '../../../_services/comment/comment.service';
import { CookieUtilsService } from '../../../_services/cookieUtils/cookie-utils.service';
import { DialogsService } from '../../../_services/dialogs/dialog.service';
import { ContentService } from '../../../_services/content/content.service';
import * as moment from 'moment';
import {Router} from '@angular/router';

@Component({
  selector: 'app-content-inperson',
  templateUrl: './content-inperson.component.html',
  styleUrls: ['./content-inperson.component.scss']
})
export class ContentInpersonComponent implements OnInit {

    public userType = 'public';
    public experienceId = '';
    public chatForm: FormGroup;
    public replyForm: FormGroup;
    public replyingToCommentId: string;
    public comments: Array<any>;
    public userId;
    public attachmentUrls = [];
    public duration = 0;
    public lat;
    public lng;

    constructor(
        public config: AppConfig,
        public _collectionService: CollectionService,
        @Inject(MD_DIALOG_DATA) public data: any,
        public dialogRef: MdDialogRef<ContentInpersonComponent>,
        private _fb: FormBuilder,
        private _commentService: CommentService,
        private _cookieUtilsService: CookieUtilsService,
        private dialogsService: DialogsService,
        private contentService: ContentService,
        private router: Router
    ) {
        this.userType = data.userType;
        this.experienceId = data.collectionId;
        this.userId = _cookieUtilsService.getValue('userId');
        data.content.supplementUrls.forEach(file => {
            this.contentService.getMediaObject(file).subscribe((res) => {
                this.attachmentUrls.push(res[0]);
            });
        });
        const startMoment = moment(data.content.schedules[0].startTime);
        const endMoment = moment(data.content.schedules[0].endTime);
        const contentLength = moment.utc(endMoment.diff(startMoment)).format('HH');
        this.duration = parseInt(contentLength, 10);
        if (data.content.locations && data.content.locations.length > 0) {
            this.lat = parseFloat(data.content.locations[0].map_lat);
            this.lng = parseFloat(data.content.locations[0].map_lng);
        }
    }

    ngOnInit() {
        this.initializeForms();
        this.getDiscussions();
    }

    private initializeForms() {
        this.chatForm = this._fb.group({
            description: ['', Validators.required]
        });
    }

    /**
     * postComment
     */
    public postComment() {
        this._collectionService.postContentComments(this.data.content.id, this.chatForm.value, (err, response) => {
            if (err) {
                console.log(err);
            } else {
                this.chatForm.reset();
                this.getDiscussions();
            }
        });
    }

    public createReplyForm(comment: any) {
        this.replyingToCommentId = comment.id;
        this.replyForm = this._fb.group({
            description: ''
        });
    }

    /**
     * postReply
     */
    public postReply(comment: any) {
        this._commentService.replyToComment(comment.id, this.replyForm.value).subscribe(
            response => {
                this.getDiscussions();
                delete this.replyForm;
            }, err => {
                console.log(err);
            }
        );
    }

    private getDiscussions() {
        const query = {
            'include': [
                {
                    'peer': [
                        { 'profiles': ['work'] }
                    ]
                },
                {
                    'replies': [
                        {
                            'peer': [
                                {
                                    'profiles': ['work']
                                }
                            ]
                        },
                        {
                            'upvotes': 'peer'
                        }
                    ]
                },
                {
                    'upvotes': 'peer'
                }
            ],
            'order': 'createdAt DESC'
        };
        this._collectionService.getContentComments(this.data.content.id, query, (err, response) => {
            if (err) {
                console.log(err);
            } else {
                this.comments = response;
            }
        });
    }

    addCommentUpvote(comment: any) {
        this._commentService.addCommentUpvote(comment.id, {}).subscribe(
            response => {
                if (comment.upvotes !== undefined) {
                    comment.upvotes.push(response.json());
                }
                else {
                    comment.upvotes = [];
                    comment.upvotes.push(response.json());
                }
            }, err => {
                console.log(err);
            }
        );
    }

    addReplyUpvote(reply: any) {
        this._commentService.addReplyUpvote(reply.id, {}).subscribe(
            response => {
                if (reply.upvotes !== undefined) {
                    reply.upvotes.push(response.json());
                }
                else {
                    reply.upvotes = [];
                    reply.upvotes.push(response.json());
                }
            }, err => {
                console.log(err);
            }
        );
    }

    public hasUpvoted(upvotes) {
        let result = false;
        if (upvotes !== undefined) {
            upvotes.forEach(upvote => {
                if (upvote.peer !== undefined) {
                    if (upvote.peer[0].id === this.userId) {
                        result = true;
                    }
                }
                else {
                    result = true;
                }
            });
        }
        return result;
    }

    public isMyComment(comment) {
        return comment.peer[0].id === this.userId;
    }

    public openProfilePage(peerId) {
        this.router.navigate(['profile', peerId]);
    }

    public rsvpToggle(content) {
      // RSVP for participant
    }

    public viewRSVPs(content) {
      // Show rsvps to user
    }

}
