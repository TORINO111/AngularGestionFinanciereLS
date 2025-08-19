import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { LayoutEventType } from 'src/app/core/constants/events';
import { EventService } from 'src/app/core/service/event.service';
import { LAYOUT_DETACHED, LAYOUT_VERTICAL, LAYOUT_WIDTH_FLUID, LEFT_SIDEBAR_THEME_LIGHT, LEFT_SIDEBAR_TYPE_DEFAULT, MENU_POSITION_FIXED, TOPBAR_THEME_LIGHT } from '../config/layout.model';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnInit {

  // layout related config
  @Input() layoutType!: string;
  @Input() layoutWidth!: string;
  @Input() menuPosition!: string;
  @Input() leftSidebarTheme!: string;
  @Input() leftSidebarType!: string;
  @Input() showSidebarUserInfo: boolean = false;
  @Input() topbarTheme!: string;
  disableLeftBarSize: boolean = false;

  rightSidebarClass = 'right-bar-enabled';

  private isShowing: boolean = false;

  constructor (
    private renderer: Renderer2,
    private eventService: EventService
  ) {
    // listen to event and open/hide the right sidebar
    // show
    this.eventService.on(LayoutEventType.SHOW_RIGHT_SIDEBAR).subscribe(() => {
      this.show();
    });

    // hide
    this.eventService.on(LayoutEventType.HIDE_RIGHT_SIDEBAR).subscribe(() => {
      this.hide();
    });

  }

  ngOnInit(): void {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
  }

  ngOnChanges(): void {
    if (this.isShowing) {
      this.renderer.addClass(document.body, this.rightSidebarClass);
    } else {
      this.renderer.removeClass(document.body, this.rightSidebarClass);
    }
  }

  /**
* changes left sidebar type based on screen dimensions
*/
  updateDimensions(): void {
    if (window.innerWidth <= 991) {
      this.disableLeftBarSize = true;
    }
    else if (window.innerWidth > 991) {
      this.disableLeftBarSize = false;
    }
  }

  /**
 * Shows the sidebar
 */
  show(): void {
    this.isShowing = true;
    this.renderer.addClass(document.body, this.rightSidebarClass);
  }

  /**
   * Hide the sidebar
   */
  hide(): void {
    if (document.body.classList.contains(this.rightSidebarClass)) {
      this.renderer.removeClass(document.body, this.rightSidebarClass);
      this.isShowing = false;
    }
  }

  /**
   * Change the given layout
   * @param layout layout name
   */
  changeLayout(layout: string): void {
    this.layoutType = layout;
    this.eventService.broadcast(LayoutEventType.CHANGE_LAYOUT, layout);
  }

  /**
   * Change the width
   * @param layout width type
   */
  changeLayoutWidth(width: string): void {
    this.layoutWidth = width;
    this.eventService.broadcast(LayoutEventType.CHANGE_LAYOUT_WIDTH, width);
  }

  /**
   * Change left and top menu position
   * @param position position of menu
   */
  changeMenuPosition(position: string): void {
    this.menuPosition = position;
    this.eventService.broadcast(LayoutEventType.CHANGE_MENU_POSITION, position);
  }

  /**
   * Change the side bar theme
   * @param theme name
   */
  changeLeftSidebarTheme(theme: string): void {
    this.leftSidebarTheme = theme;
    this.eventService.broadcast(LayoutEventType.CHANGE_LEFT_SIDEBAR_THEME, theme);
  }

  /**
   * Change the side bar width
   * @param type type of sidebar
   */
  changeLeftSidebarType(type: string): void {
    this.leftSidebarType = type;
    if (this.layoutType === LAYOUT_VERTICAL || this.layoutType === LAYOUT_DETACHED) {
      this.eventService.broadcast(LayoutEventType.CHANGE_LEFT_SIDEBAR_TYPE, type);
    }
  }

  /**
 * Change topbar theme
 * @param theme name
 */
  changeTopbarTheme(theme: string): void {
    this.topbarTheme = theme;
    this.eventService.broadcast(LayoutEventType.CHANGE_TOPBAR_THEME, theme);
  }

  /**
   * toggles visibility of sidebar user info
   * @param show true/false
   */
  toggleLeftSidebarUserInfo(show: boolean): void {
    this.showSidebarUserInfo = show;
    if (this.layoutType === LAYOUT_VERTICAL || this.layoutType === LAYOUT_DETACHED) {
      this.eventService.broadcast(LayoutEventType.TOGGLE_SIDEBAR_USERINFO, show);
    }
  }


  /**
   * Reset everything
   */
  reset(): void {
    this.changeLayout(LAYOUT_VERTICAL);
    this.changeLayoutWidth(LAYOUT_WIDTH_FLUID);
    this.changeMenuPosition(MENU_POSITION_FIXED);
    this.changeLeftSidebarType(LEFT_SIDEBAR_TYPE_DEFAULT);
    this.changeLeftSidebarTheme(LEFT_SIDEBAR_THEME_LIGHT);
    this.toggleLeftSidebarUserInfo(false);
    this.changeTopbarTheme(TOPBAR_THEME_LIGHT);
  }

}
