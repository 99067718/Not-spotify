import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  Count = 0;
  Secret(){
    this.Count += 1;
    var Icon = document.getElementById("icon");
    if (this.Count == 5){
      Icon?.setAttribute("src", "../../../assets/images/DedIcon.png")
    }
    else if (this.Count == 15){
      Icon?.setAttribute("src", "../../../assets/images/DustIcon.png")
    }
    else if (this.Count == 25){
      Icon?.setAttribute("src", "../../../assets/images/FinalIcon.gif")
      var TopBar = document.getElementById("navBar");
      TopBar?.setAttribute("class", "navPartyMode");
      setTimeout(() => {
        var appNameComponent = document.getElementById("appName");
        appNameComponent?.setAttribute("class", "namePartyMode")
      }, 1000);
      
    }
  };
}
