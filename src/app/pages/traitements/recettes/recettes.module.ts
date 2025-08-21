import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { RecettesRoutingModule } from './recettes-routing.module';
import { RecettesComponent } from './recettes.component';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select'; 

@NgModule({
  declarations: [
    RecettesComponent
  ],
  imports: [
    CommonModule,
    PageTitleModule,
    ReactiveFormsModule,
    RecettesRoutingModule,
    NgSelectModule,
    FormsModule
  ]
})
export class RecettesModule { }
