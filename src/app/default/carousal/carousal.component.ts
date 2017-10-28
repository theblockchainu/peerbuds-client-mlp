import {Component} from '@angular/core';
import {Image} from './image.interface';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'css-carousal',
  templateUrl: './carousal.component.html',
  styleUrls: ['./carousal.component.scss']
})
//Carousel Component itself
export class CSSCarouselComponent {
    //images data to be bound to the template
	// tslint:disable-next-line:indent
	public images = IMAGES;
}

//IMAGES array implementing Image interface
const IMAGES: Image[] = [
	// tslint:disable-next-line:indent
	{ 'title': 'Feels great to learn in Peerbuds', 'url': '/assets/images/images_landing/testimonial1.png' },
    { 'title': 'Happy to be a teacher in Peerbuds', 'url': '/assets/images/images_landing/testimonial3.png' },
    { 'title': 'Peerbuds is the best!', 'url': '/assets/images/images_landing/testimonial1.png' },
    { 'title': 'This is awesome!', 'url': '/assets/images/images_landing/testimonial3.png' },
    { 'title': 'Great work!', 'url': '/assets/images/images_landing/testimonial1.png' }
];
