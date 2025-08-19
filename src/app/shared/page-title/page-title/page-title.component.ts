import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BreadcrumbItem } from './page-title.model';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent implements OnInit {


  @Input() breadcrumbItems: BreadcrumbItem[] = [];
  @Input() title: string = '';
  @Input() windowTitle?: string;

  constructor (private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle((this.windowTitle ? this.windowTitle : this.title) + " | Gestion Financière");
  }

}
