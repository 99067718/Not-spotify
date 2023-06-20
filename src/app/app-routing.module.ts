import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MissingPageComponent } from './pages/missing-page/missing-page.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  {path: "home", component: HomePageComponent},
  {path: "", redirectTo: "/home", pathMatch: "full"},
  {path: "login", component: LoginPageComponent},
  {path: "profile", component: ProfileComponent},
  {path: "**", component: MissingPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
