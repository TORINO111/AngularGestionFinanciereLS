import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { EcrituresRoutingModule } from './ecritures-routing.module';
import { EcrituresComponent } from './ecritures.component';
import { NgSelectModule } from '@ng-select/ng-select'; 

@NgModule({
  declarations: [
    EcrituresComponent  
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageTitleModule,
    EcrituresRoutingModule,
    NgSelectModule
  ]
})
export class EcrituresModule { }
