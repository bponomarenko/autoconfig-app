import { Directive, ElementRef, OnInit, Renderer, Input, HostBinding } from '@angular/core';

@Directive({
  selector: '[acIcon]'
})
export class IconDirective implements OnInit {
  @Input('acIcon') icon: string;

  constructor(private el: ElementRef, private renderer: Renderer) {}

  ngOnInit() {
    const nativeEl = this.el.nativeElement;
    this.renderer.setElementClass(nativeEl, 'material-icons', true);
    this.renderer.setElementClass(nativeEl, 'align-middle', true);
    this.renderer.createText(nativeEl, this.icon.replace(/\s/g, '_'))
  }
}
