import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsoleProfileComponent } from '../console-profile.component';
import { ProfileService } from '../../../_services/profile/profile.service';
import { MediaUploaderService } from '../../../_services/mediaUploader/media-uploader.service';
import { AppConfig } from '../../../app.config';

declare var moment: any;

@Component({
  selector: 'app-console-profile-photos',
  templateUrl: './console-profile-photos.component.html',
  styleUrls: ['./console-profile-photos.component.scss']
})
export class ConsoleProfilePhotosComponent implements OnInit {
  public picture_url: string;
  public profile_picture_array = [];
  public profile_video: string;

  public loaded: boolean;
  constructor(
    public activatedRoute: ActivatedRoute,
    public consoleProfileComponent: ConsoleProfileComponent,
    public router: Router,
    public _profileService: ProfileService,
    public mediaUploader: MediaUploaderService,
    public config: AppConfig,
  ) {
    activatedRoute.pathFromRoot[4].url.subscribe((urlSegment) => {
      console.log(urlSegment[0].path);
      consoleProfileComponent.setActiveTab(urlSegment[0].path);
    });
  }

  ngOnInit() {
    this.loaded = false;
    this._profileService.getProfile().subscribe((profiles) => {
      this.picture_url = profiles[0].picture_url;
      this.profile_video = profiles[0].profile_video;
      this.loaded = true;
    });

  }

  uploadVideo(event) {
    // const xhrResp = JSON.parse(event.xhr.response);
    // console.log(xhrResp);
    // this._profileService.updateProfile({
    //   'profile_video': xhrResp.url
    // }).subscribe(response => {
    //   this.profile_video = response.profile_video;
    // }, err => {
    //   console.log(err);
    // });
    for (const file of event.files) {
      this.mediaUploader.upload(file).subscribe((response) => {
          this.profile_video = response.url;
        });
    }
  }

  // uploadImages(event) {
  //   const xhrResp = JSON.parse(event.xhr.response);
  //   console.log(xhrResp);
  //   this._profileService.updateProfile({
  //     'picture_url': xhrResp.url
  //   }).subscribe(response => {
  //     this.picture_url = response.picture_url;
  //   }, err => {
  //     console.log(err);
  //   });
  // }

  uploadImage(event) {
    // console.log(event.files);
    for (const file of event.files) {
      this.mediaUploader.upload(file).subscribe((response) => {
          this.profile_picture_array.push(response.url);
        });
    }
  }

  setProfilePic(image, type) {
    this._profileService.updateProfile({
      'picture_url': image
    }).subscribe(response => {
        this.picture_url = response.url;
      }, err => {
        console.log(err);
    });
  }


  deleteFromContainerArr(event) {
    console.log(event);
  }

  deleteFromContainer(url: string, type: string) {
    if (type === 'image') {
      this._profileService.updateProfile({
        'picture_url': ''
      }).subscribe(response => {
        this.picture_url = response.picture_url;
      });
    } else if (type === 'video') {
      this._profileService.updateProfile({
        'profile_video': ''
      }).subscribe(response => {
        this.profile_video = response.profile_video;
      });
    } else {
      console.log('error');

    }
  }

}
