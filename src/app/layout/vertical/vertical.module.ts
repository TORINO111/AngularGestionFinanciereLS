import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VerticalLayoutComponent } from './layout/layout.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    VerticalLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [VerticalLayoutComponent]
})
export class VerticalModule { }
