import {Injectable} from '@angular/core';
import {RequestHeaderService} from '../requestHeader/request-header.service';
import {AppConfig} from '../../app.config';
import {Http} from '@angular/http';

@Injectable()
export class QuestionService {

    public options;

    constructor(private http: Http,
                private config: AppConfig,
                private requestHeaderService: RequestHeaderService) {
        this.options = requestHeaderService.getOptions();
    }


    /**
     * Add an answer to given question
     * @param questionId
     * @param answerBody
     */
    public answerToQuestion(questionId, answerBody) {
        return this.http
            .post(this.config.apiUrl + '/api/questions/' + questionId + '/answers', answerBody, this.options);
    }

    /**
     * Add the current user as follower of this question
     * @param questionId
     * @param peerId
     */
    public addFollower(questionId, peerId) {
        return this.http
            .put(this.config.apiUrl + '/api/questions/' + questionId + '/followers/rel/' + peerId, this.options);
    }

    /**
     * Post a comment to an answer
     * @param answerId
     * @param commentBody
     */
    public postCommentToAnswer(answerId, commentBody) {
        return this.http
            .post(this.config.apiUrl + '/api/answers/' + answerId + '/comments', commentBody, this.options);
    }

    /**
     * Post a comment to a question
     * @param questionId
     * @param commentBody
     */
    public postCommentToQuestion(questionId, commentBody) {
        return this.http
            .post(this.config.apiUrl + '/api/questions/' + questionId + '/comments', commentBody, this.options);
    }

    /**
     * Add an upvote to the given question
     * @param questionId
     * @param upvoteBody
     */
    public addQuestionUpvote(questionId, upvoteBody) {
        return this.http
            .post(this.config.apiUrl + '/api/questions/' + questionId + '/upvotes', upvoteBody, this.options);
    }

    /**
     * Add an upvote to given answer
     * @param answerId
     * @param upvoteBody
     */
    public addAnswerUpvote(answerId, upvoteBody) {
        return this.http
            .post(this.config.apiUrl + '/api/answers/' + answerId + '/upvotes', upvoteBody, this.options);
    }

    /**
     * Delete a question from DB
     * @param {string} questionId
     */
    public deleteQuestion(questionId: string) {
        return this.http
            .delete(this.config.apiUrl + '/api/questions/' + questionId, this.options);
    }

    /**
     * Delete an answer from DB
     * @param {string} answerId
     */
    public deleteAnswer(answerId: string) {
        return this.http
            .delete(this.config.apiUrl + '/api/answers/' + answerId, this.options);
    }

}
