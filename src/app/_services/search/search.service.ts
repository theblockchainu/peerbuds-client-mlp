import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Http} from '@angular/http';
import {AppConfig} from '../../app.config';

@Injectable()
export class SearchService {

    constructor(private router: Router,
                private http: Http,
                private config: AppConfig) {
    }


    public getAllSearchResults(userId, query: any, cb) {
        if (userId) {
            this.http
                .get(this.config.searchUrl + '/searchAll?' + 'query=' + query)
                .map((response) => {
                    console.log(response.json());
                    cb(null, response.json());
                }, (err) => {
                    cb(err);
                }).subscribe();
        }
    }

    public getCommunitySearchResults(userId, query: any, cb) {
        if (userId) {
            this.http
                .get(this.config.searchUrl + '/searchCommunity?' + 'query=' + query)
                .map((response) => {
                    console.log(response.json());
                    cb(null, response.json());
                }, (err) => {
                    cb(err);
                }).subscribe();
        }
    }

    public getSearchOptionText(option) {
        switch (option.index.split('_')[1]) {
            case 'collection':
                switch (option.data.type) {
                    case 'workshop':
                        return option.data.title;
                    case 'experience':
                        return option.data.title;
                    default:
                        return option.data.title;
                }
            case 'topic':
                return option.data.name;
            case 'community':
                return option.data.title;
            case 'question':
                return option.data.text;
            case 'peer':
                if (option.data.profiles[0] === undefined) {
                    return option.data.id;
                }
                else if (option.data.profiles[0] !== undefined && option.data.profiles[0].first_name === undefined) {
                    return option.data.id;
                } else {
                    return option.data.profiles[0].first_name + ' ' + option.data.profiles[0].last_name;
                }
            default:
                return;
        }
    }

    public getSearchOptionType(option) {
        switch (option.index.split('_')[1]) {
            case 'collection':
                switch (option.data.type) {
                    case 'workshop':
                        return 'Workshop : ';
                    case 'experience':
                        return 'Experience : ';
                    default:
                        return 'Collection : ';
                }
            case 'topic':
                return 'Topic : ';
            case 'community':
                return 'Community: ';
            case 'question':
                return 'Question: ';
            case 'peer':
                return 'Peer : ';
            default:
                return;
        }
    }

    public onSearchOptionClicked(option) {
        switch (option.index.split('_')[1]) {
            case 'collection':
                switch (option.data.type) {
                    case 'workshop':
                        this.router.navigate(['/workshop', option.data.id]);
                        break;
                    case 'experience':
                        this.router.navigate(['/experience', option.data.id]);
                        break;
                    default:
                        this.router.navigate(['/console/dashboard']);
                        break;
                }
                break;
            case 'topic':
                this.router.navigate(['/console/profile/topics']);
                break;
            case 'community':
                this.router.navigate(['/community', option.data.id]);
                break;
            case 'question':
                this.router.navigate(['/question', option.data.id]);
                break;
            case 'peer':
                this.router.navigate(['/profile', option.data.id]);
                break;
            default:
                break;
        }
    }

}
