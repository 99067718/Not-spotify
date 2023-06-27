import { Component, OnInit, ElementRef } from '@angular/core';
import { SpotifyApiService } from '../../services/spotify-api.service';
import Swal from 'sweetalert2';
import {CookieService} from 'ngx-cookie-service';



@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    savedData: any = {};
  elementRef: any;
    constructor(private spotifyApiService: SpotifyApiService) {}
    ngOnInit(): void {
        this.getUserProfile()
    }
    getUserProfile(): void {
      // while (continueLoop){
        this.spotifyApiService.getMe().then((data) => {
          console.log('User profile', data);
          this.savedData = data;
          console.log(this.savedData)
          this.GetLikeList()
        }).catch((error) => {
          console.log(error);
            Swal.fire({title: "Log in to view your profile", imageUrl:"https://media.tenor.com/UTneqy4va7AAAAAC/anime-nigarundayo.gif"})
            .then((answer => {
              if (answer.isConfirmed) {
                try{
                  this.spotifyApiService.refreshAccessToken()
                  this.getUserProfile()
                }catch(error){
                  this.getUserProfile()
                }
                window.location.href = "http://localhost:4200";
              }
            }))
        });
      // }
        
    }
    logOut(): void {
      localStorage.clear();
      window.location.href = "https://www.spotify.com/logout/";
    }
  likelist: any = {};
    GetLikeList(){
      const container = document.getElementById("likelist");
      if (container != null){
        this.likelist = this.spotifyApiService.displaySongs(container);
        console.log(this.likelist)
      }
    }
  
  isOwnUserProfileEmpty(): boolean {
      // return true
      return !this.savedData || Object.keys(this.savedData).length === 0;
}
  
}
