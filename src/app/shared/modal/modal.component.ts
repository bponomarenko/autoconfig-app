import { Component, ViewChild, Input, Output, EventEmitter, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';

@Component({
  selector: 'ac-modal',
  templateUrl: './modal.component.html'
})
export class ModalComponent implements AfterViewInit, OnChanges {
  @Input() header: string;
  @Input() disableCancel: boolean = false;
  @Input() large: boolean = false;
  @Input('in-progress') inProgress: boolean = false;
  @Input('action-text') actionBtnText: string;
  @Input('action-disabled') actionBtnDisabled: boolean = false;
  @Input('cancel-text') cancelBtnText: string;
  @Output('action') onAction: EventEmitter<any>;
  @Output('cancel') onCancel: EventEmitter<any>;
  @ViewChild('modal') modal: ModalDirective;

  constructor() {
    this.onAction = new EventEmitter<any>();
    this.onCancel = new EventEmitter<any>();
  }

  ngAfterViewInit() {
    if(this.disableCancel && this.modal.config) {
      this.modal.config.keyboard = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const progressChange = changes['inProgress'];
    if(progressChange && this.modal.config && !this.disableCancel) {
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

  get onShown(): EventEmitter<ModalDirective> {
    return this.modal.onShown;
  }

  show() {
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }

  protected onActionBtnClick(data?: any) {
    this.onAction.emit(data);
  }

  protected onCancelBtnClick() {
    this.onCancel.emit();
  }
}
