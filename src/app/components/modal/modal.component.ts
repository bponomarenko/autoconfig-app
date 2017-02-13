import { Component, ViewChild, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';

@Component({
  selector: 'ac-modal',
  templateUrl: './modal.component.html'
})
export class ModalComponent implements OnChanges {
  @Input() header: string;
  @Input('in-progress') inProgress: boolean = false;
  @Input('action') actionBtnAction: Function;
  @Input('action-text') actionBtnText: string;
  @Input('action-disabled') actionBtnDisabled: boolean;
  @Input('cancel') cancelBtnAction: Function;
  @Input('cancel-text') cancelBtnText: string;
  @ViewChild('modal') modal: ModalDirective;

  ngOnChanges(changes: SimpleChanges) {
    const progressChange = changes['inProgress'];
    if(progressChange && this.modal.config) {
      // Disable dialog dismissal by keyboard while dialog in progress, re-enable afterwards
      this.modal.config.keyboard = !progressChange.currentValue;
    }
  }

  get onHidden(): EventEmitter<ModalDirective> {
    return this.modal.onHidden;
  }

  get onShow(): EventEmitter<ModalDirective> {
    return this.modal.onShow;
  }

  show() {
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }
}
