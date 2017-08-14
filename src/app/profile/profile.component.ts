import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { AppConfig } from '../app.config';
import { ProfileService } from '../_services/profile/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public profile: any = {};
  public socialProfile: any = [];
  public interestTopics: any = [];
  public allReviews: any = [];
  public max = 5;
  public rate = 5;
  public isReadonly = true;
  public userType = 'learner';

  constructor(private config: AppConfig, public profileService: ProfileService) { }

  ngOnInit() {
    this.getUserType(this.setUserData.bind(this));
  }

  setUserData() {
    this.getProfile();
    this.getSocialProfiles();
    this.getInterestTopics();
    this.getAllReviews();
  }

  getProfile() {
    this.profileService.getProfile().subscribe(profile => {
      this.profile = profile[0];
    });
  }

  getSocialProfiles() {
    this.profileService.socialProfiles().subscribe(socialProfile => {
      this.socialProfile = socialProfile;
      this.socialProfile.forEach(thisProfile => {
        thisProfile.profile = JSON.parse(thisProfile.profile);
      });
    });
  }

  getUserType(setUserData) {
    this.profileService.getOwnedCollectionCount().subscribe(collection_count => {
      if (collection_count.count > 0) {
        this.userType = 'teacher';
      }
      setUserData();
    });
  }

  getInterestTopics() {
    this.profileService.interestTopics(this.userType).subscribe(interestTopics => {
      this.interestTopics = interestTopics;
    });
  }

  getAllReviews() {
    this.profileService.getCollections()
      .subscribe(collections => {
        collections.forEach(collection => {

          this.profileService.getReviews(collection.id)
            .subscribe(reviews => {

              reviews.forEach((review, i) => {

                review.collection = {
                  'type': collection.type,
                  'title': collection.title,
                  'headline': collection.headline,
                  'createdAt': collection.createdAt
                };


              });

              console.log('outside reviewer cb');
              this.allReviews.push.apply(this.allReviews, reviews);
              this.setReviewer();
            });
        });
      });
  }

  setReviewer() {
    this.allReviews.forEach((review, i) => {
      this.profileService.getReviewer(review.id)
        .subscribe(reviewer => {
          review.reviewer = reviewer[0];
          console.log('in reviewer cb');
        });
    });
     console.log(JSON.stringify(this.allReviews));
  }
}
