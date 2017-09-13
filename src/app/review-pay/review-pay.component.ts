import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AppConfig } from '../app.config';
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';
import { CookieUtilsService } from '../_services/cookieUtils/cookie-utils.service';
import { ProfileService } from '../_services/profile/profile.service';
import * as moment from 'moment';
import { PaymentService } from '../_services/payment/payment.service';
import { Response } from '@angular/http';
import { CollectionService } from '../_services/collection/collection.service';

@Component({
  selector: 'app-review-pay',
  templateUrl: './review-pay.component.html',
  styleUrls: ['./review-pay.component.scss']
})
export class ReviewPayComponent implements OnInit {
  public userId: string;
  public collectionId;
  public collection = {};
  public collectionTitle = '';
  public cardNumber: string;
  public expiryMonth: string;
  public expiryYear: any = [];
  public cvc: string;
  public message: string;
  public confirmAmount = '';
  public makePaymentForm: FormGroup;
  public savingData = false;
  public loader = 'assets/images/ajax-loader.gif';
  public peerEmail;
  public tokenId;
  public custId;
  public createSourceData = { token: '', email: '' };
  public createChargeData = { amount: 0 , currency: 'usd', source: '', description: '', customer: '' };
  public isCardExist = false;
  public listAllCards = [];
  public presentYear: any = new Date().getFullYear();
  public maxYear = (this.presentYear + 10);
  public periodStarts = this.presentYear;

  constructor(public config: AppConfig,
    private cookieUtilsService: CookieUtilsService,
    private activatedRoute: ActivatedRoute,
    private _fb: FormBuilder, public router: Router,
    public profileService: ProfileService,
    public paymentService: PaymentService,
    public collectionService: CollectionService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.collectionId = params['collectionId'];
    });

    this.userId = cookieUtilsService.getValue('userId');
  }

  ngOnInit() {
    this.makePaymentForm = this._fb.group({
      cardNumber: [null, [Validators.required, Validators.maxLength(16), Validators.pattern('^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$')]],
      expiryMonth: '',
      expiryYear: '',
      cvc: [null, [Validators.required]],
    });

    this.collectionService.getCollectionDetails(this.collectionId).subscribe(collectionData => {
      if (collectionData) {
        this.createChargeData.amount = (collectionData.price) * 10 ;
        // this.createChargeData.amount = collectionData.price ;
        this.createChargeData.description = collectionData.description;
        this.collection = collectionData;
      }
    });

    this.profileService.getPeer(this.userId).subscribe(peer => {
      if (peer) {
        this.createSourceData.email = peer.email;
        this.createChargeData.customer = peer.stripeCustId;
        this.custId = peer.stripeCustId;

        // get all cards
        this.paymentService.listAllCards(this.custId).subscribe(cards => {
          if (cards) {
            this.listAllCards = cards.json().data;
            // console.log('listAllCards: ' + JSON.stringify(this.listAllCards));
          }
        });
      }

    });
    // console.log(this.custId);

    this.loadYear();
  }

// Load year
  loadYear() {
    for (let index = this.periodStarts; index <= this.maxYear; index++) {
      this.expiryYear.push(index);
    }
  }

  getToken() {
    // this.message = 'Loading...';
    this.savingData = true;

    if (this.listAllCards && this.listAllCards.length > 0) {
      const cardLastFour = (this.makePaymentForm.controls['cardNumber'].value).substr(-4);
      this.listAllCards.forEach(card => {
        if (card.last4 === cardLastFour) {
          this.isCardExist = true;
          this.createChargeData.source = card.id;
        }
      });
    }

    if (this.isCardExist === true) {
      // console.log('card exist');
      this.paymentService.createCharge(this.collectionId, this.createChargeData).subscribe((resp: Response) => {
        if (resp) {
          // console.log(JSON.stringify(resp.json()));
          this.savingData = false;
          this.message = 'Payment Confirmation Success!';
        }
      });
    }
    else {
      (<any>window).Stripe.card.createToken({
        number: this.makePaymentForm.controls['cardNumber'].value,
        exp_month: this.makePaymentForm.controls['expiryMonth'].value,
        exp_year: this.makePaymentForm.controls['expiryYear'].value,
        cvc: this.makePaymentForm.controls['cvc'].value
      }, (status: number, response: any) => {
        if (status === 200) {
          this.message = 'Payment Confirmation Success!';
          this.createSourceData.token = response.id;
          this.savingData = false;

          this.paymentService.createSource(this.custId, this.createSourceData).subscribe((res: Response) => {
            if (res) {
              //console.log(JSON.stringify(res.json()));
              this.createChargeData.source = res.json().id;
              this.paymentService.createCharge(this.collectionId, this.createChargeData).subscribe();
            }
          });
        } else {
          this.message = response.error.message;
          this.savingData = false;
        }
      });
    }
  }
}
