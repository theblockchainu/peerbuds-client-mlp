import { SignupComponentDialog } from './signup-dialog/signup-dialog.component';
import { LoginComponentDialog } from './login-dialog/login-dialog.component';
import { AddCardDialogComponent } from './add-card-dialog/add-card-dialog.component';
import { LiveSessionDialogComponent } from './live-session-dialog/live-session-dialog.component';
import { MultiselectTopicDialogComponent } from './multiselect-topic-dialog/multiselect-topic-dialog.component';
import { Observable } from 'rxjs/Rx';
import { VerifyIdDialogComponent } from './verify-id-dialog/verify-id-dialog.component';
import { VerifyEmailDialogComponent } from './verify-email-dialog/verify-email-dialog.component';
import { IdPolicyDialogComponent } from './id-policy-dialog/id-policy-dialog.component';
import { VideoDialogComponent } from './video-dialog/video-dialog.component';
import { VerifyPhoneDialogComponent } from './verify-phone-dialog/verify-phone-dialog.component';
import { CollectionGridDialogComponent } from './collection-grid-dialog/collection-grid-dialog.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { ProfilePopupCardComponent } from './profile-popup-card/profile-popup-card.component';
import { RequestPasswordDialogComponent } from './forgot-pwd-dialog/forgot-pwd-dialog.component';
import { ExitCollectionDialogComponent } from './exit-collection-dialog/exit-collection-dialog.component';
import { CancelCollectionDialogComponent } from './cancel-collection-dialog/cancel-collection-dialog.component';
import { DeleteCollectionDialogComponent } from './delete-collection-dialog/delete-collection-dialog.component';
import { EditCalendarDialogComponent } from './edit-calendar-dialog/edit-calendar-dialog.component';
import { AddTopicDialogComponent } from './add-topic-dialog/add-topic-dialog.component';
import { AddLanguageDialogComponent } from './add-language-dialog/add-language-dialog.component';
import { ViewConflictDialogComponent } from './view-conflict-dialog/view-conflict-dialog.component';
import { } from './';
import {
    CalendarEvent
} from 'angular-calendar';
import { SelectDateDialogComponent } from './select-date-dialog/select-date-dialog.component';
import { CollectionCloneDialogComponent } from './collection-clone-dialog/collection-clone-dialog.component';
import { CollectionSubmitDialogComponent } from './collection-submit-dialog/collection-submit-dialog.component';
import { SubmissionViewComponent } from './submission-view/submission-view.component';
import { SubmitEntryComponent } from './submit-entry/submit-entry.component';
import { ViewEntryDialogComponent } from './view-entry-dialog/view-entry-dialog.component';
import { InviteFriendsDialogComponent } from './invite-friends-dialog/invite-friends-dialog.component';
@Injectable()
export class DialogsService {

    constructor(public dialog: MdDialog
    ) { }

    public openSignup() {
        let dialogRef: MdDialogRef<SignupComponentDialog>;

        dialogRef = this.dialog.open(SignupComponentDialog);

        return dialogRef.afterClosed();
    }

    public openLogin() {
        let dialogRef1: MdDialogRef<LoginComponentDialog>;

        dialogRef1 = this.dialog.open(LoginComponentDialog);

        return dialogRef1.afterClosed();
    }
    public addCard() {
        let dialogRef4: MdDialogRef<AddCardDialogComponent>;

        dialogRef4 = this.dialog.open(AddCardDialogComponent, {
            width: '610px',
            height: '380px'
        });
        return dialogRef4.afterClosed();
    }
    public openIdVerify() {
        let dialogRef5: MdDialogRef<VerifyIdDialogComponent>;

        dialogRef5 = this.dialog.open(VerifyIdDialogComponent, {
            width: '60vw',
            height: '95vh'
        });
        return dialogRef5.afterClosed();
    }
    public openEmailVerify() {
        let dialogRef6: MdDialogRef<VerifyEmailDialogComponent>;

        dialogRef6 = this.dialog.open(VerifyEmailDialogComponent, {
            width: '650px',
            height: '600px'
        });
        return dialogRef6.afterClosed();
    }
    public openIdPolicy() {
        let dialogRef7: MdDialogRef<IdPolicyDialogComponent>;

        dialogRef7 = this.dialog.open(IdPolicyDialogComponent, {
            width: '500px',
            height: '600px'
        });
        return dialogRef7.afterClosed();
    }

    public openVideo(url: string) {
        let dialogRef8: MdDialogRef<VideoDialogComponent>;

        dialogRef8 = this.dialog.open(VideoDialogComponent, {
            width: '1000px',
            panelClass: 'video-popup',
            data: url
        });
        return dialogRef8.afterClosed();
    }
    public openPhoneVerify() {
        let dialogRef9: MdDialogRef<VerifyPhoneDialogComponent>;

        dialogRef9 = this.dialog.open(VerifyPhoneDialogComponent, {
            width: '500px',
            height: '600px'
        });
        return dialogRef9.afterClosed();
    }

    public openFollowTopicDialog(type, searchTopicURL) {
        let dialogRef5: MdDialogRef<MultiselectTopicDialogComponent>;

        dialogRef5 = this.dialog.open(MultiselectTopicDialogComponent,
            {
                disableClose: true,
                hasBackdrop: true,
                width: '50vw',
                height: '70vh'
            }
        );
        dialogRef5.componentInstance.data = {
            searchUrl: searchTopicURL,
            selected: []
        };

        return dialogRef5.afterClosed();
    }

    // /**
    //  * startLiveSession
    //  */
    // public startLiveSession() {
    //     let dialogRef5: MdDialogRef<LiveSessionDialogComponent>;

    //     dialogRef5 = this.dialog.open(LiveSessionDialogComponent, {
    //         width: '100vw',
    //         height: '100vh'
    //     });
    //     return dialogRef5.afterClosed();
    // }

    /**
     * openCollectionGrid
     */
    public openCollectionGrid(title, collections) {
        let dialogRef: MdDialogRef<CollectionGridDialogComponent>;

        dialogRef = this.dialog.open(CollectionGridDialogComponent, {
            width: '80vw',
            height: '80vh',
            data: {
                title: title,
                collections: collections
            }
        });

        return dialogRef.afterClosed();
    }

    openDeleteDialog(action: string) {
        const dialogRef = this.dialog.open(DeleteDialogComponent, {
            data: action
        });
        return dialogRef.afterClosed();
    }

    openDeleteCollection(collection: any) {
        const dialogRef = this.dialog.open(DeleteCollectionDialogComponent, {
            data: collection,
            height: '23vh'
        });

        return dialogRef.afterClosed();
    }

    openExitCollection(collection: any) {
        const dialogRef = this.dialog.open(ExitCollectionDialogComponent, {
            data: collection,
            height: '23vh'
        });
        return dialogRef.afterClosed();
    }

    openCancelCollection(collection: any) {
        const dialogRef = this.dialog.open(CancelCollectionDialogComponent, {
            data: collection,
            height: '23vh'
        });
        return dialogRef.afterClosed();
    }

    openProfilePopup(config: any) {
        return this.dialog.open(ProfilePopupCardComponent, config);
    }

    openForgotPassword(email: string) {
        return this.dialog.open(RequestPasswordDialogComponent, {
            data: email
        });
    }


    public editCalendar(collection, contents, calendars, allItinerary, participants, events: CalendarEvent[], userId: string, startDate: Date, endDate: Date): Observable<boolean> {
        let dialogRef: MdDialogRef<EditCalendarDialogComponent>;

        dialogRef = this.dialog.open(EditCalendarDialogComponent, {
            width: '80vw',
            height: '99vh'
        }
        );
        dialogRef.componentInstance.collection = collection;
        dialogRef.componentInstance.contents = contents;
        dialogRef.componentInstance.calendars = calendars;
        dialogRef.componentInstance.allItenaries = allItinerary;
        dialogRef.componentInstance.participants = participants;
        dialogRef.componentInstance.inpEvents = events;
        dialogRef.componentInstance.userId = userId;
        dialogRef.componentInstance.startDate = startDate;
        dialogRef.componentInstance.endDate = endDate;

        return dialogRef.afterClosed();
    }

    public deleteCollection(action) {
        let dialogRef: MdDialogRef<DeleteDialogComponent>;

        dialogRef = this.dialog.open(DeleteDialogComponent);
        dialogRef.componentInstance.action = action;

        return dialogRef.afterClosed();

    }

    public addNewTopic() {
        let dialogRef: MdDialogRef<AddTopicDialogComponent>;

        dialogRef = this.dialog.open(AddTopicDialogComponent);

        return dialogRef.afterClosed();

    }

    public addNewLanguage() {
        let dialogRef: MdDialogRef<AddLanguageDialogComponent>;

        dialogRef = this.dialog.open(AddLanguageDialogComponent);

        return dialogRef.afterClosed();

    }

    /**
     * startLiveSession
     */
    public startLiveSession(data: any) {
        let dialogRef5: MdDialogRef<LiveSessionDialogComponent>;

        dialogRef5 = this.dialog.open(LiveSessionDialogComponent, {
            panelClass: 'my-full-screen-dialog',
            data: data
        });
        return dialogRef5.afterClosed();
    }

    public selectDateDialog(allItenaries, mode, participants, userType) {
        return this.dialog.open(SelectDateDialogComponent, {
            width: '70vw',
            height: '90vh',
            data: { itineraries: allItenaries, mode: mode, participants: participants, userType: userType }
        }).afterClosed();
    }

    public openCollectionCloneDialog(collection: any) {
        return this.dialog.open(CollectionCloneDialogComponent,
            {
                data: collection,
                disableClose: true, hasBackdrop: true, width: '30vw'
            }).afterClosed();
    }

    public openCollectionSubmitDialog(collection: any) {
        return this.dialog.open(CollectionSubmitDialogComponent,
            {
                data: collection,
                disableClose: true, hasBackdrop: true, width: '40vw'
            }).afterClosed();
    }

    public submissionView(userType, submission, peerHasSubmission, collectionId) {
        return this.dialog.open(SubmissionViewComponent, {
            data: {
                userType: userType,
                submission: submission,
                peerHasSubmission: peerHasSubmission,
                collectionId: collectionId
            },
            width: '50vw',
            height: '90vh'
        }).afterClosed();
    }

    /**
     * submitEntry
     */
    public submitEntry(data) {
        return this.dialog.open(SubmitEntryComponent, {
            data: data,
            width: '50vw',
            height: '90vh'
        }).afterClosed();
    }

    public viewEntry(data) {
        return this.dialog.open(ViewEntryDialogComponent, {
            data: data,
            width: '45vw',
            height: '100vh'
        }).afterClosed();
    }

    public inviteFriends(collection) {
        return this.dialog.open(InviteFriendsDialogComponent, {
            data: {
                url: collection.type + '/' + collection.id
            },
            width: '40vw'
        }).afterClosed();
    }

}
