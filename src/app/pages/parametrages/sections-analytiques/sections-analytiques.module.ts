import { SectionAnalytiqueRoutingModule } from './sections-analyitques-routing.module';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select'; 
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { SectionsAnalytiquesComponent } from './sections-analytiques.component';

@NgModule({
  declarations: [
    SectionsAnalytiquesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageTitleModule,
    ReactiveFormsModule,
    SectionAnalytiqueRoutingModule,
    NgSelectModule
  ]
})
export class SectionsAnalytiquesModule{ }
