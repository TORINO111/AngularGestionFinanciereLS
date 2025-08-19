import { Directive } from '@angular/core';
import feather from 'feather-icons';

@Directive({
  selector: '[appFeatherIcon]'
})
export class FeatherIconDirective {

  constructor () { }

  ngAfterViewInit() {
    // feather icon
    feather.replace();
  }

}
