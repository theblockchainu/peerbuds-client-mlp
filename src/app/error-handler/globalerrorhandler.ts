import { ErrorHandler, Injectable, Injector } from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) { }
    handleError(error) {
        const router = this.injector.get(Router);
        const message = error.message ? error.message : error.toString();
        // log on the server
        router.navigate(['home', 'homefeed']);
        throw error;
    }
}
