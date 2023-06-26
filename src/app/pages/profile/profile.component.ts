import { Component, OnInit } from '@angular/core';
import { SpotifyApiService } from '../../services/spotify-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(private spotifyApiService: SpotifyApiService) {}
  ngOnInit(): void {
    this.getUserProfile()
  }
  getUserProfile(): void {
    this.spotifyApiService.getMe().then((data) => {
      console.log('User profile', data);
      var profilePicture = document.getElementById("pfpimage");
      console.log(data.images[0].url)
      profilePicture?.setAttribute("src", data.images[0].url)
    }).catch((error) => {
      Swal.fire({
        title: 'Log in to view your profile',
        imageUrl: 'https://media.tenor.com/UTneqy4va7AAAAAC/anime-nigarundayo.gif'
      })
      console.log(error);
      Swal.fire("Log in to view your profile")
    });
  }
  
}
