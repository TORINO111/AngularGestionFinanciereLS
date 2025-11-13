import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAllowAlphanumericWithAccents]'
})
export class AllowAlphanumericWithAccentsDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const initalValue = this._el.nativeElement.value;
    // Allows alphanumeric characters, spaces, and common accented characters
    this._el.nativeElement.value = initalValue.replace(/[^a-zA-Z0-9\s\u00C0-\u017F]*/g, '');
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
