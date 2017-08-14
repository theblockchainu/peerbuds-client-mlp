import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../app.config';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/map';

@Injectable()
export class CurrencypickerService {

  constructor(private http: HttpClient, private config: AppConfig
    , private route: ActivatedRoute, public router: Router) {
  }

  /**
   * Get currencies from server
   * @returns {Observable<any>}
   */
  public getCurrencies() {
    return this.http.get(this.config.apiUrl + '/api/currencies')
      .map((response: any) => {
        return response;
      });
  }

}
