import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutContainerComponent } from './layout-container.component';
import { VerticalModule } from './vertical/vertical.module';
import { SharedModule } from './shared/shared.module';
import { HorizontalModule } from './horizontal/horizontal.module';
import { TwoColumnModule } from './two-column/two-column.module';
import { DetachedModule } from './detached/detached.module';



@NgModule({
  declarations: [
    LayoutContainerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    VerticalModule,
    HorizontalModule,
    DetachedModule,
    TwoColumnModule
  ]
})
export class LayoutModule { }
