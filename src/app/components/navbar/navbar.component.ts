import { Component, OnInit } from '@angular/core';
import { SpotifyApiService } from '../../services/spotify-api.service'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  ngOnInit(): void {
  if (localStorage.getItem("spotifyAccessToken") != null){
    try{
        var token = localStorage.getItem("spotifyAccessToken");
        try{
          if (token != null){
            this.spotifyApiService.setAccessToken(token);
            localStorage.setItem("spotifyAccessToken", token)
          }
        }
        catch(error){
          try{
            // Assuming you're working with Angular and using RxJS

            var newtoken: string;

            this.spotifyApiService.refreshAccessToken().subscribe(
              (response: any) => {
                if (response != null) {
                  newtoken = response as string;
                  localStorage.removeItem("spotifyAccessToken");
                  localStorage.setItem("spotifyAccessToken", newtoken);
                  this.spotifyApiService.setAccessToken(newtoken);
                }
                
              },
              (error: any) => {
                alert(error)
              }
            );
          }
          catch(error){
            alert("No tokens have been found in the database, please log in to continue");
          }
      }
    } catch(error){
      alert("something went wrong");
    }
    this.getLoginStatus()
}
  }
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
  constructor(private spotifyApiService: SpotifyApiService) {}

  onLogin(): void {
    this.spotifyApiService.authorize();
  }

  onGetUser(): void {
    this.spotifyApiService.getMe().then((user) => {
      // handle user data
    }).catch((error) => {
      // handle error
    });
  }

  getLoginStatus(): void{
    var accessToken = localStorage.getItem("spotifyAccessToken") as string;
this.spotifyApiService.checkAccessTokenValidity(accessToken).subscribe(
  (isLoggedin: boolean) => {
    console.log(isLoggedin);

    if (isLoggedin) {
      var loginbutton = document.getElementById("login-button");
      if (loginbutton != null) {
        loginbutton.style.display = "none";
      }
    }
  },
  (error: any) => {
    console.error('Error checking access token validity:', error);
  }
);
  }
}
