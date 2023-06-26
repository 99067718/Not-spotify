import { Component, OnInit } from '@angular/core';
import { SpotifyApiService } from '../../services/spotify-api.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    savedData: any = {};
    constructor(private spotifyApiService: SpotifyApiService) {}
    ngOnInit(): void {
        this.getUserProfile()
    }
    getUserProfile(): void {
      let continueLoop = true;
      // while (continueLoop){
        console.log(continueLoop)
        this.spotifyApiService.getMe().then((data) => {
          console.log('User profile', data);
          this.savedData = data;
          console.log(this.savedData)
          continueLoop = false;
        }).catch((error) => {
            //Swal.fire({title: "Log in to view your profile", imageUrl:"https://media.tenor.com/UTneqy4va7AAAAAC/anime-nigarundayo.gif"})
            console.log(error);
            try{
              this.spotifyApiService.refreshAccessToken()
              this.getUserProfile()
              continueLoop = false;
            }catch(error){
              this.getUserProfile()
              continueLoop = false;
            }
        });
      // }
        
    }
  
  isOwnUserProfileEmpty(): boolean {
      // return true
      return !this.savedData || Object.keys(this.savedData).length === 0;
}
  
}
