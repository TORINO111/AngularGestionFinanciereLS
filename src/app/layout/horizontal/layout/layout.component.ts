import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { LayoutEventType } from 'src/app/core/constants/events';
import { EventService } from 'src/app/core/service/event.service';
import { getLayoutConfig, changeBodyAttribute } from '../../shared/helper/utils';

@Component({
  selector: 'app-horizontal-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class HorizontalLayoutComponent implements OnInit {

  @Input() layoutWidth: string = '';
  menuPosition: string = "";
  leftSidebarTheme: string = "";
  leftSidebarType: string = "";
  topbarTheme: string = "";
  showSidebarUserInfo: boolean = false;
  reRender: boolean = true;
  showMobileMenu: boolean = false;

  constructor (
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    let config = getLayoutConfig('horizontal');
    this.menuPosition = config.menuPosition;
    this.leftSidebarTheme = config.leftSidebarTheme;
    this.leftSidebarType = config.leftSidebarType;
    this.topbarTheme = config.topbarTheme;
    this.showSidebarUserInfo = config.showSidebarUserInfo;

    // listen to event and change the layout configuarations
    this.eventService.on(LayoutEventType.CHANGE_MENU_POSITION).subscribe(({ payload }) => {
      this.menuPosition = payload;
    });

    this.eventService.on(LayoutEventType.CHANGE_LEFT_SIDEBAR_THEME).subscribe(({ payload }) => {
      this.leftSidebarTheme = payload;
    });

    this.eventService.on(LayoutEventType.CHANGE_LEFT_SIDEBAR_TYPE).subscribe(({ payload }) => {
      this.leftSidebarType = payload;
    });

    this.eventService.on(LayoutEventType.CHANGE_TOPBAR_THEME).subscribe(({ payload }) => {
      this.topbarTheme = payload;
    });

    this.eventService.on(LayoutEventType.TOGGLE_SIDEBAR_USERINFO).subscribe(({ payload }) => {
      this.showSidebarUserInfo = payload;
    });
    this.changeLayoutConfig();
  }


  /**
 * On view init - activating horizontal layout
 */
  ngAfterViewInit() {
    changeBodyAttribute('data-layout-mode', 'horizontal')
  }

  /**
 * changes layout configurations 
 */
  ngOnChanges(changes: SimpleChange) {
    this._setRerender();
    this.changeLayoutConfig();
  }

  ngDoCheck(): void {
    this.changeLayoutConfig();
  }

  ngOnDestroy(): void {
    changeBodyAttribute('data-layout-mode', '', 'remove');
  }

  /**
   * controls re-rendering
   */
  _setRerender = () => {
    this.reRender = false;
    setTimeout(() => {
      this.reRender = true;
    }, 0.05);
  }



  /**
 * changes layout related options
 */
  changeLayoutConfig(): void {

    // boxed vs fluid
    changeBodyAttribute('data-layout-width', this.layoutWidth);

    // scrollable menus
    changeBodyAttribute('data-layout-menu-position', this.menuPosition);

    // left sidebar type
    changeBodyAttribute('data-sidebar-size', this.leftSidebarType);

    // left sidebar theme
    changeBodyAttribute('data-sidebar-color', this.leftSidebarTheme);

    // topbar theme
    changeBodyAttribute('data-topbar-color', this.topbarTheme);
  }


  /**
* on settings button clicked from topbar
*/
  onSettingsButtonClicked() {
    this.eventService.broadcast(LayoutEventType.SHOW_RIGHT_SIDEBAR);
  }

  /**
 * On mobile toggle button clicked
 */
  onToggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }



}
