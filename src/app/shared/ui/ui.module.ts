import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherIconDirective } from './feather-icon.directive';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import { PreloaderComponent } from './preloader/preloader.component';

@NgModule({
  declarations: [
    FeatherIconDirective,
    DefaultLayoutComponent,
    PreloaderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [FeatherIconDirective, DefaultLayoutComponent, PreloaderComponent]
})
export class UiModule { }
