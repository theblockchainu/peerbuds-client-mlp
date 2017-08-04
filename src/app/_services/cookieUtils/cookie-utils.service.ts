import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class CookieUtilsService {

  constructor(private _cookieService: CookieService) { }

  public getValue(key: string) {
    const cookieValue = this._cookieService.get(key).split(/[ \:.]+/);
    return cookieValue[1];
  }
}
