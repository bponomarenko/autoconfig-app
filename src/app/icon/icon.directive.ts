import { Directive, ElementRef, OnInit, Renderer, Input, HostBinding } from '@angular/core';

@Directive({
  selector: '[acIcon]'
})
export class IconDirective implements OnInit {
  @Input('acIcon') icon: string;

  constructor(private el: ElementRef, private renderer: Renderer) {}

  ngOnInit() {
    this.renderer.setElementClass(this.el.nativeElement, 'material-icons', true);
    this.renderer.setElementClass(this.el.nativeElement, 'align-middle', true);
    this.renderer.createText(this.el.nativeElement, this.icon.replace(/\s/g, '_'))
  }
}
