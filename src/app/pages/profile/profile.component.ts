import { Component } from '@angular/core';
import { SpotifyApiService } from '../../services/spotify-api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  constructor(private spotifyApiService: SpotifyApiService) {}

  getUserProfile(): void {
    this.spotifyApiService.getMe().then((data) => {
      console.log('User profile', data);
    }).catch((error) => {
      console.error('Error', error);
    });
  }
}
