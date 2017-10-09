import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppConfig } from '../../../app.config';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommentService} from '../../../_services/comment/comment.service';
import {CollectionService} from '../../../_services/collection/collection.service';

@Component({
  selector: 'app-content-video',
  templateUrl: './content-video.component.html',
  styleUrls: ['./content-video.component.scss']
})
export class ContentVideoComponent implements OnInit {

  public userType = 'public';
  public workshopId = '';
  public chatForm: FormGroup;
  public replyForm: FormGroup;
  public replyingToCommentId: string;
  public comments: Array<any>;

  constructor(
    public config: AppConfig,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _collectionService: CollectionService,
    public dialogRef: MatDialogRef<ContentVideoComponent>,
    private _fb: FormBuilder,
    private _commentService: CommentService,
  ) {
      this.userType = data.userType;
      this.workshopId = data.collectionId;
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

}
