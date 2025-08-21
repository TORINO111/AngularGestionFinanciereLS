import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-default-layout',
    templateUrl: './default-layout.component.html',
    styleUrls: ['./default-layout.component.scss'],
    standalone: false
})
export class DefaultLayoutComponent implements OnInit {

  constructor () { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    document.body.classList.add('authentication-bg');
  }

}
