import { Component, OnInit } from '@angular/core';
import { PageTitleModule } from "src/app/shared/page-title/page-title.module";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [PageTitleModule]
})
export class DashboardComponent implements OnInit {
  loading: boolean = true;

  constructor() { }

  ngOnInit(): void {
    // Simulate data loading
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

}
