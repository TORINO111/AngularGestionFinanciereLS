import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { ArticlesRoutingModule } from './articles.routing.module';
import { NgSelectModule } from '@ng-select/ng-select'; 
import { ArticlesComponent } from './articles.component';

@NgModule({
  declarations: [
    ArticlesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageTitleModule,
    ReactiveFormsModule,
    ArticlesRoutingModule,
    NgSelectModule,
  ]
})
export class ArticlesModule { }
