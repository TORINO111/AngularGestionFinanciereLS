import { Component, OnInit } from '@angular/core';
import { LayoutEventType } from '../core/constants/events';
import { EventService } from '../core/service/event.service';
import { LAYOUT_DETACHED, LAYOUT_HORIZONTAL, LAYOUT_TWO_COLUMN_MENU, LAYOUT_VERTICAL, LAYOUT_WIDTH_BOXED, LEFT_SIDEBAR_TYPE_CONDENSED, LEFT_SIDEBAR_TYPE_DEFAULT } from './shared/config/layout.model';
import { getLayoutConfig } from './shared/helper/utils';
import { LayoutConfig } from './shared/models/layout-config.model';

@Component({
  selector: 'app-layout-container',
  templateUrl: './layout-container.component.html',
  styleUrls: ['./layout-container.component.scss']
})
export class LayoutContainerComponent implements OnInit {

  layoutType!: string;
  layoutConfig!: LayoutConfig;
  layoutWidth!: string;

  constructor (private eventService: EventService) {
  }

  ngOnInit(): void {
    this.layoutType = sessionStorage.getItem("Layout_Type") || LAYOUT_VERTICAL;
    this.setLayoutConfig();

    // listen to event and change the layout configuarations
    this.eventService.on(LayoutEventType.CHANGE_LAYOUT).subscribe(({ payload }) => {
      this.layoutType = payload;
      this.setLayoutConfig();
    });

    this.eventService.on(LayoutEventType.CHANGE_LAYOUT_WIDTH).subscribe(({ payload }) => {
      setTimeout(() => {
        this.layoutWidth = payload;
        if (this.layoutWidth === LAYOUT_WIDTH_BOXED) {
          this.eventService.broadcast(LayoutEventType.CHANGE_LEFT_SIDEBAR_TYPE, LEFT_SIDEBAR_TYPE_CONDENSED);
        } else {
          this.eventService.broadcast(LayoutEventType.CHANGE_LEFT_SIDEBAR_TYPE, LEFT_SIDEBAR_TYPE_DEFAULT);
        }
      }, 20);
    });

  }

  ngAfterViewInit(): void {
    document.body.classList.remove('authentication-bg');
    if (sessionStorage.getItem("Layout_Type")) sessionStorage.removeItem("Layout_Type");
    if (sessionStorage.getItem("Leftsidebar_Theme")) sessionStorage.removeItem("Leftsidebar_Theme");
    if (sessionStorage.getItem("Layout_Width")) sessionStorage.removeItem("Layout_Width");
    if (sessionStorage.getItem("Leftsidebar_Type")) sessionStorage.removeItem("Leftsidebar_Type");
    if (sessionStorage.getItem("Menu_Position")) sessionStorage.removeItem("Menu_Position");
    if (sessionStorage.getItem("Topbar_Theme")) sessionStorage.removeItem("Topbar_Theme");
  }

  /**
   * set layout config
   */
  setLayoutConfig(): void {
    this.layoutConfig = getLayoutConfig(this.layoutType);
    this.layoutWidth = this.layoutConfig.layoutWidth;
  }

  /**
   * Check if the vertical layout is requested
   */
  isVerticalLayoutRequested() {
    return this.layoutType === LAYOUT_VERTICAL;
  }

  /**
   * Check if the horizontal layout is requested
   */
  isHorizontalLayoutRequested() {
    return this.layoutType === LAYOUT_HORIZONTAL;
  }

  /**
   * Check if the detached layout is requested
   */
  isDetachedLayoutRequested() {
    return this.layoutType === LAYOUT_DETACHED;
  }

  /**
   * Check if two column layout is requested
   */
  isTwoColumnMenuLayoutRequested() {
    return this.layoutType === LAYOUT_TWO_COLUMN_MENU;
  }



}
