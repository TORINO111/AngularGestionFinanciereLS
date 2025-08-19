import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from './service/event.service';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule
  ],
  providers: [{ provide: EventService, useValue: new EventService() }]
})
export class CoreModule {
  static forRoot(): any[] | import("@angular/core").Type<any> | import("@angular/core").ModuleWithProviders<{}> {
    return {
      ngModule: CoreModule,
      providers: [
        { provide: EventService, useValue: new EventService() }
      ]
    };
  }
}
