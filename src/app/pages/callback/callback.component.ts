import { Component, OnInit } from '@angular/core';
import { SpotifyApiService } from '../../services/spotify-api.service'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {
  constructor(private spotifyApiService: SpotifyApiService, private route: ActivatedRoute) {}
    ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    const state = this.route.snapshot.queryParamMap.get('state');
    
    if (code && state) {
      // Code and state are available, you can use them here
      this.handleAuthorizationCode(code, state);
    } else {
      // Code or state is not available in the URL
      // Handle the situation accordingly
    }
  }
   handleAuthorizationCode(code: string, state: string): void {
      this.spotifyApiService.exchangeAuthorizationCode(code, state).subscribe(
        (response) => {
          const accessToken = response.access_token;
          const refreshToken = response.refresh_token;
          this.spotifyApiService.setAccessToken(accessToken);
  
          // Save the access token and refresh token to localStorage or any other storage mechanism
          localStorage.removeItem("spotifyAccessToken");
          localStorage.removeItem("spotifyRefreshToken");
          localStorage.setItem('spotifyAccessToken', accessToken);
          localStorage.setItem('spotifyRefreshToken', refreshToken);
          window.location.href = "http://localhost:4200";
          // Perform any other necessary actions after successful token exchange
        },
        (error) => {
          // Handle error response from token exchange
        }
      );
    }
    
}
