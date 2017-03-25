import { Directive, ElementRef, OnInit, Renderer, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[acIcon]'
})
export class IconDirective implements OnInit, OnChanges {
  @Input('acIcon') icon: string;

  constructor(private el: ElementRef, private renderer: Renderer) {}

  private get iconValue(): string {
    return this.icon.replace(/\s/g, '_');
  }

  ngOnInit() {
    const nativeEl = this.el.nativeElement;
    this.renderer.setElementClass(nativeEl, 'material-icons', true);
    this.renderer.setElementClass(nativeEl, 'align-middle', true);
    this.el.nativeElement.innerText = this.iconValue;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['icon']) {
      this.el.nativeElement.innerText = this.iconValue;
    }
  }
}
