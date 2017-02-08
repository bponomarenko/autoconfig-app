import {
  Directive,
  ElementRef,
  OnInit,
  Renderer,
  Input
} from '@angular/core';

@Directive({
  selector: '[acIcon]'
})
export class IconDirective implements OnInit {
  private className: string = 'material-icons';

  @Input('acIcon') icon: string;

  constructor(private el: ElementRef, private renderer: Renderer) {}

  ngOnInit() {
    this.renderer.setElementClass(this.el.nativeElement, this.className, true);
    this.renderer.createText(this.el.nativeElement, this.icon.replace(/\s/g, '_'))
  }
}
