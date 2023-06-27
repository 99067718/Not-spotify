import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import SpotifyWebApi from 'spotify-web-api-js';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../keys';
import { ProfileComponent } from '../pages/profile/profile.component';

@Injectable({
    providedIn: 'root'
})
export class SpotifyApiService {
    private clientId = environment.spotify.clientId;
    private redirectUri = environment.spotify.redirectUri;
    private tokenEndpoint = 'https://accounts.spotify.com/api/token';
    private accessToken: string | null = null;
    apiUrl = 'https://api.spotify.com/v1'

    constructor(private http: HttpClient) { }

    setAccessToken(token: string): void {
        this.accessToken = token;
    }

    getLikedList(offset: number = 0, limit: number = 20): Observable<any> {
        const url = `${this.apiUrl}/me/tracks`;
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem("spotifyAccessToken"));
        const params = { offset: offset.toString(), limit: limit.toString() };
    
        return this.http.get(url, { headers, params });
      }
    
      displaySongs(container: HTMLElement): void {
        const limit = 50; // Number of tracks to retrieve per request
        let offset = 0; // Offset to paginate through the tracks
    
        this.fetchSongs(offset, limit, container);
      }
    
      fetchSongs(offset: number, limit: number, container: HTMLElement): void {
        this.getLikedList(offset, limit).subscribe(
          (response: any) => {
            const tracks = response.items;
            tracks.forEach((track: any) => {
              const songName = track.track.name;
              const imageUrl = track.track.album.images[0].url;
    
              const songItem = document.createElement('div');
              songItem.style.backgroundColor = "darkgreen";
              songItem.style.borderRadius = "10px"
              songItem.style.height = "180px";
              songItem.style.width = "120px";
              songItem.className = 'song-item';
              songItem.style.justifyContent = "center";
    
              const songImage = document.createElement('img');
              songImage.src = imageUrl;
              songImage.width = 100;
              songImage.style.marginRight = "10px";
              songImage.style.display = "flex";
              songImage.style.borderRadius = "10px";
              songImage.className = 'song-image';
    
              const songNameElement = document.createElement('div');
              songNameElement.innerText = songName;
              songNameElement.className = 'song-name';
    
              songItem.appendChild(songImage);
              songItem.appendChild(songNameElement);
              container.appendChild(songItem);
            });
    
            const total = response.total;
            const remaining = total - (offset + limit);
    
            if (remaining > 0) {
              offset += limit;
              this.fetchSongs(offset, limit, container);
            }
          },
          (error: any) => {
            console.error('Error retrieving likelist:', error);
          }
        );
      }
    authorize(redirectURI: string = ''): void {
        localStorage.setItem('redirectFromSpotifyTo', redirectURI)
        const scopes = ['user-read-private', 'user-follow-read', 'user-library-read', 'user-top-read', 'playlist-modify-public', 'playlist-modify-private'];
        const state = this.generateRandomString(16);
        const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=${encodeURIComponent(scopes.join(' '))}&state=${state}`;

        // Redirect the user to the authorizeUrl
        window.location.href = authorizeUrl;
    }

    refreshAccessToken(): Observable<any> {
        const url = 'https://accounts.spotify.com/api/token';
        const headers = new HttpHeaders().set(
        'Authorization',
        'Basic ' + btoa(environment.spotify.clientId + ':' + environment.spotify.clientSecret)
        );
        const body = new HttpParams()
        .set('grant_type', 'refresh_token')
        .set('refresh_token', localStorage.getItem("spotifyRefreshToken") as string);
        console.log(localStorage.getItem("spotifyRefreshToken"))

        return this.http.post(url, body.toString(), { headers });
        }
    
        checkAccessTokenValidity(accessToken: string): Observable<boolean> {
          const url = `${this.apiUrl}/me`;
      
          const headers = new HttpHeaders().set('Authorization', 'Bearer ' + accessToken);
      
          return this.http.get(url, { headers, observe: 'response' }).pipe(
            map((response: HttpResponse<any>) => {
              const statusCode = response.status;
              if (statusCode === 200) {
                return true; // Access token is considered valid if the response status code is 200 (OK)
              } else {
                return false; // Access token is considered invalid for any other status code
              }
            })
          );
        }
        
    checkIfLoggedIn(redirectURI: string = '', autoLogin: boolean = true): boolean {
        this.accessToken = localStorage.getItem('spotifyAccessToken');
        if (this.accessToken == null) {
            if (autoLogin) {
                this.authorize(redirectURI)
            }
            return false
        } else {
            this.setAccessToken(this.accessToken)
            return true
        }
    }

    exchangeAuthorizationCode(code: string, state: string): Observable<any> {
        const tokenEndpoint = 'https://accounts.spotify.com/api/token';
        const clientId = environment.spotify.clientId;
        const clientSecret = environment.spotify.clientSecret;
        const redirectUri = environment.spotify.redirectUri;
      
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        const body = new HttpParams()
          .set('grant_type', 'authorization_code')
          .set('code', code)
          .set('redirect_uri', redirectUri)
          .set('client_id', clientId)
          .set('client_secret', clientSecret);
      
        return this.http.post<any>(tokenEndpoint, body, { headers });
      }
      

    private generateRandomString(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
        for (let i = 0; i < length; i++) {
            randomString += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return randomString;
    }

    getMe(): Promise<any> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
        return this.http.get<any>(`${this.apiUrl}/me`, { headers }).toPromise();
    }

    getFollowedArtists(): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken);

        return this.http.get<any>(`${this.apiUrl}/me/following?type=artist`, { headers });
    }

    getMyPlaylists(limit: number, offset: number): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken);

        return this.http.get<any>(`${this.apiUrl}/me/playlists?limit=${String(limit)}&offset=${String(offset)}`, { headers });
    }

    getAvailableGenres(): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken);

        return this.http.get<any>(`${this.apiUrl}/recommendations/available-genre-seeds`, { headers });
    }

    getTopTracks(): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.accessToken);

        const queryParams = {
            time_range: 'short_term',
            limit: '25'
        };

        return this.http.get<any>(`${this.apiUrl}/me/top/tracks`, { headers, params: queryParams });
    }
      


    // Other methods for interacting with the Spotify API
}
