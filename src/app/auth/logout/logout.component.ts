import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor (private authenticationService: AuthenticationService, private titleService: Title) {
    titleService.setTitle("Logout | GESTION FINANCIERE")
  }

  ngOnInit(): void {
    this.authenticationService.logout();
  }

}
