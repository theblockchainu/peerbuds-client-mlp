import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../app.config';
@Component({
    selector: 'app-error',
    templateUrl: './error-handler.component.html',
    styleUrls: ['./error-handler.component.scss']
})

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private injector: Injector,
        public _appConfig: AppConfig) { }
    handleError(error) {
        const router = this.injector.get(Router);
        const message = error.message ? error.message : error.toString();
        // location.reload();
        // TODO: log on the server
        router.navigate(['error']);
        //throw error;
    }
}
