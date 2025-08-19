import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DetachedLayoutComponent } from './layout/layout.component';


@NgModule({
  declarations: [
    DetachedLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    DetachedLayoutComponent
  ]
})
export class DetachedModule { }
