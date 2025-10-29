import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { ClientsNumexisRoutingModule } from './clients-numexis-routing.module';
import { ClientsNumexisComponent } from './clients-numexis.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    ClientsNumexisComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageTitleModule,
    ReactiveFormsModule,
    ClientsNumexisRoutingModule,
    NgSelectModule
  ]
})
export class ClientsNumexisModule { }
