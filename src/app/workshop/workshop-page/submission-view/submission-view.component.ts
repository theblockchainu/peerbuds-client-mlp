import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AppConfig } from '../../../app.config';
import {CollectionService} from '../../../_services/collection/collection.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommentService} from '../../../_services/comment/comment.service';
import {ProjectSubmissionService} from '../../../_services/project-submission/project-submission.service';
import {CookieUtilsService} from '../../../_services/cookieUtils/cookie-utils.service';

@Component({
  selector: 'app-submission-view',
  templateUrl: './submission-view.component.html',
  styleUrls: ['./submission-view.component.scss']
})
export class SubmissionViewComponent implements OnInit {

    public isMySubmission = false;
    public userId;
    public iHaveUpvoted = false;
  public userType = 'public';
  public workshopId = '';
  public chatForm: FormGroup;
  public replyForm: FormGroup;
  public replyingToCommentId: string;
  public comments: Array<any>;

  constructor( public config: AppConfig,
     @Inject(MAT_DIALOG_DATA) public data: any,
     public _collectionService: CollectionService,
     public dialogRef: MatDialogRef<SubmissionViewComponent>,
     private _fb: FormBuilder,
     private _commentService: CommentService,
       private _submissionService: ProjectSubmissionService,
       private _cookieUtilsService: CookieUtilsService
  ) {
    this.userType = data.userType;
    this.workshopId = data.collectionId;
    this.userId = _cookieUtilsService.getValue('userId');
    if (data.submission.peer[0].id === this.userId) {
        this.isMySubmission = true;
    }
    data.submission.upvotes.forEach(upvote => {
        if (upvote.peer[0].id === this.userId) {
            this.iHaveUpvoted = true;
        }
    });
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
      this._collectionService.postSubmissionComments(this.data.submission.id, this.chatForm.value, (err, response) => {
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
      this._collectionService.getSubmissionComments(this.data.submission.id, query, (err, response) => {
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

    addSubmissionUpvote(submission: any) {
        this._submissionService.addSubmissionUpvote(submission.id, {}).subscribe(
            response => {
                if (submission.upvotes !== undefined) {
                    submission.upvotes.push(response.json());
                }
                else {
                    submission.upvotes = [];
                    submission.upvotes.push(response.json());
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

  closeDialog() {
    this.dialogRef.close();
  }

}
