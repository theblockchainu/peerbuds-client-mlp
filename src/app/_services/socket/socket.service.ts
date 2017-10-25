import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { CookieUtilsService } from '../../_services/cookieUtils/cookie-utils.service';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable()
export class SocketService {

    private url = 'http://localhost:3000';
    private socket;
    private userId;

    constructor(
        private authService: AuthenticationService,
        private _cookieUtilsService: CookieUtilsService
    ) {
        this.userId = _cookieUtilsService.getValue('userId');
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
