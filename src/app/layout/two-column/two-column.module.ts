import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideModule } from 'ng-click-outside';
import { SimplebarAngularModule } from 'simplebar-angular';
import { UiModule } from 'src/app/shared/ui/ui.module';
import { TwoColumnMenuLayoutComponent } from './layout/layout.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { IconMenuComponent } from './icon-menu/icon-menu.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    TwoColumnMenuLayoutComponent,
    LeftSidebarComponent,
    IconMenuComponent,
    MainMenuComponent
  ],
  imports: [
    CommonModule,
    NgbCollapseModule,
    NgbTooltipModule,
    ClickOutsideModule,
    SimplebarAngularModule,
    RouterModule,
    SharedModule,
    UiModule
  ],
  exports: [
    TwoColumnMenuLayoutComponent
  ]
})
export class TwoColumnModule { }
