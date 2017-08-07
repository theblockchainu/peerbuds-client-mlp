import { AppConfig } from '../../app.config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class MediaUploaderService {

  constructor(private http: HttpClient, private config: AppConfig, private sanitizer: DomSanitizer) { }

  public upload(file) {
    if (!file.objectURL) {
      file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file)));
    }
    file.src = file.objectURL.changingThisBreaksApplicationSecurity;
      console.log(file);
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.config.apiUrl + '/api/media/upload?container=peerbuds-dev1290', formData);
  }

}
