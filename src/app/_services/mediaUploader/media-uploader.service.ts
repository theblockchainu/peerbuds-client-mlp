import { AppConfig } from '../../app.config';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class MediaUploaderService {
  private options;

  constructor(private http: HttpClient,
              private config: AppConfig,
              private sanitizer: DomSanitizer) {}

  public upload(file) {
    let type = file;
    if (!file.objectURL) {
      file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file)));
    }
    file.src = file.objectURL.changingThisBreaksApplicationSecurity;
    console.log(file);
    const formData = new FormData();
    if (file.type.includes('image/'))
    {
      type = 'image';
    }
    else if (file.type.includes('video/')) {
      type = 'video';
    }
    else {
      type = 'file';
    }
    formData.append(type, file, file.name);
    return this.http.post(this.config.apiUrl + '/api/media/upload?container=peerbuds-dev1290',
                          formData,
                          { withCredentials: true })
                    .map((response: Response) => response);
  }

}