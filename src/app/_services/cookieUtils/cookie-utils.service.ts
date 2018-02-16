import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import * as moment from 'moment';

@Injectable()
export class CookieUtilsService {

  constructor(private _cookieService: CookieService) {
  }

  public getValue(key: string) {
    const cookieValue = this._cookieService.get(key).split(/[ \:.]+/);
    console.log('getting cookie value of ' + key + ' as : ' + cookieValue);
    return cookieValue.length > 1 ? cookieValue[1] : cookieValue[0];
  }

    public setValue(name: string, value: string) {
        this._cookieService.delete(name, '/', 'localhost');
        this._cookieService.set(name, value, moment().add(2, 'days').toDate(), '/', 'localhost');
    }

    public deleteValue(key) {
      this._cookieService.delete(key, '/', 'localhost');
    }

}
