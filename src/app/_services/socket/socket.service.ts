import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
import {CookieService} from 'ngx-cookie-service';
import {AuthenticationService} from '../authentication/authentication.service';

@Injectable()
export class SocketService {

    private url = 'http://localhost:3000';
    private socket;
    public key = 'userId';
    private userId;

    constructor(
        private _cookieService: CookieService,
        private authService: AuthenticationService
    ) {
        this.authService.getLoggedInUser.subscribe((userId) => {
            if (userId !== 0) {
                this.userId = userId;
            }
            else {
                this.userId = 0;
            }
        });
        this.socket = io(this.url);
        if (this.userId !== undefined) {
            const user = {
                id: this.userId
            };
            this.socket.emit('addUser', user);
        }
    }

    public sendMessage(message) {
        this.socket.emit('message', message);
    }

    public sendStartView(view) {
        this.socket.emit('startView', view);
    }

    public sendEndView(view) {
        this.socket.emit('endView', view);
    }


    // LISTENERS
    public listenForViewStarted() {
        return new Observable(observer => {
            this.socket.on('startedView', (data) => {
               observer.next(data);
            });
            return;
        });
    }

    public listenForViewEnded() {
        return new Observable(observer => {
            this.socket.on('endedView', (data) => {
                observer.next(data);
            });
            return;
        });
    }

}
