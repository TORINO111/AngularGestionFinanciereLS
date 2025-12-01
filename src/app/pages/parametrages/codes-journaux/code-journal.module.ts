import { CodeJournalComponent } from './code-journal.component';
import { CodeJournalRoutingModule } from './code-journal-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { NgSelectModule } from '@ng-select/ng-select'; 
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    CodeJournalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageTitleModule,
    CodeJournalRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModalModule
  ]
})
export class CodeJournalModule { }
