import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // Added for form handling
import { NgbModalModule, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap'; // Added for modals and pagination

import { TypeJournalRoutingModule } from './type-journal-routing-module';
import { TypeJournalComponent } from './type-journal.component'; // Renamed import and class
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module'; // Added for page title


@NgModule({
  declarations: [
    TypeJournalComponent // Renamed class
  ],
  imports: [
    CommonModule,
    TypeJournalRoutingModule,
    ReactiveFormsModule, // Added
    FormsModule,         // Added
    NgbModalModule,      // Added
    NgbPaginationModule, // Added
    NgbTypeaheadModule,  // Added (might be useful for search later)
    PageTitleModule      // Added
  ]
})
export class TypeJournalModule { }
