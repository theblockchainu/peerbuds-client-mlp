import { AppConfig } from '../../app.config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class MediaUploaderService {

  constructor(private http: HttpClient, private config: AppConfig) { }

  public upload(file) {
    file.src = file.objectURL.changingThisBreaksApplicationSecurity;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.config.apiUrl + '/api/media/upload?container=peerbuds-dev1290', formData);
  }

}
