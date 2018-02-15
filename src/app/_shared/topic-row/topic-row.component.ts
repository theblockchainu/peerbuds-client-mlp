import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-topic-row',
  templateUrl: './topic-row.component.html',
  styleUrls: ['./topic-row.component.scss']
})
export class TopicRowComponent implements OnInit {
  public translateX: number;
  public transformStyle: any;
  @Input() availableTopics: Array<any>;
  @Output() onTopicClicked = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
    this.translateX = 5;
    this.transformStyle = {
      'transform': 'translateX(5%)'
    };
  }

  public translate(increment: boolean) {
    if (increment && this.translateX < 5) {
      this.translateX += 20;
    } else if (!increment) {
      const el = document.getElementById('topic' + (this.availableTopics.length - 1));
      if (el.getClientRects()[0].left > 1500) {
        this.translateX -= 20;
      }
    }
    this.transformStyle = {
      'transform': 'translateX(' + this.translateX + '%)'
    };
  }

  public topicClicked(topicIndex: number) {
    this.onTopicClicked.emit(topicIndex);
  }

}
