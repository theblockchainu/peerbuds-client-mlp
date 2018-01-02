import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { CookieUtilsService } from '../cookieUtils/cookie-utils.service';
import {AppConfig} from '../../app.config';

@Injectable()
export class SocketService {

    private socket;
    private userId;

    constructor(
        private _cookieUtilsService: CookieUtilsService,
        private config: AppConfig
    ) {
        this.userId = _cookieUtilsService.getValue('userId');
        this.socket = io(this.config.apiUrl);
        this.addUser(this.userId);
        this.listenForNewMessage().subscribe(message => {
            console.log(message);
        });
    }

    public addUser(userId) {
        if (userId !== undefined) {
            const user = {
                id: userId
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

    public listenForNewMessage() {
        return new Observable(observer => {
            this.socket.on('message', (data) => {
                observer.next(data);
            });
            return;
        });
    }

    public joinRoom(roomId) {
        this.socket.emit('joinRoom', roomId);
    }

}
