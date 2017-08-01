import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-media-upload',
  templateUrl: './media-upload.component.html',
  styleUrls: ['./media-upload.component.scss']
})
export class MediaUploadComponent implements OnInit {

  @Input()
  public mode;

  constructor() { }

  ngOnInit() {
  }

}
