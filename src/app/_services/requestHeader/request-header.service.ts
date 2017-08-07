import { Injectable } from '@angular/core';

import {
  Headers, RequestOptions
} from '@angular/http';

@Injectable()
export class RequestHeaderService {

  constructor() { }
  getOptions() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    const options = new RequestOptions({ headers: headers, withCredentials: true });
    return options;
  }

}
