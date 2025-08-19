import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideModule } from 'ng-click-outside';
import { SimplebarAngularModule } from 'simplebar-angular';
import { UiModule } from 'src/app/shared/ui/ui.module';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  declarations: [
    LeftSidebarComponent,
    RightSidebarComponent,
    TopbarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ClickOutsideModule,
    SimplebarAngularModule,
    NgbAlertModule,
    NgbCollapseModule,
    NgbDropdownModule,
    UiModule
  ],
  exports: [
    LeftSidebarComponent,
    RightSidebarComponent,
    TopbarComponent,
    FooterComponent
  ]
})
export class SharedModule { }
