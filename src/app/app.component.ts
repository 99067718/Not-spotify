import { Component } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'test';
  constructor( private cookieService: CookieService ) { 
  }
  ClearCookies(): void{
    this.cookieService.deleteAll()
  }
}


