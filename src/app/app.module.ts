import { LoginService } from './login.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DBService } from './db.service';
import { HttpModule } from '@angular/http';
import { MapComponent } from './map/map.component';
import { NewsComponent } from './news/news.component';
import { ShopComponent } from './shop/shop.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { PostNewsComponent } from './post-news/post-news.component';
import { InquiriesComponent } from './inquiries/inquiries.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuardService } from './auth-guard.service';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from "@auth0/angular-jwt";

export function tokenGetter(){
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MapComponent,
    NewsComponent,
    ShopComponent,
    AboutComponent,
    ContactComponent,
    PostNewsComponent,
    InquiriesComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: '',component: HomeComponent},
      {path: 'map',component: MapComponent},
      {path: 'news',component: NewsComponent},
      {path: 'shop',component: ShopComponent},
      {path: 'about',component: AboutComponent},
      {path: 'postNews',component: PostNewsComponent},
      {path: 'inquiries',component: InquiriesComponent},
      {path: 'login',component: LoginComponent},
      {path: 'register',component: RegisterComponent}, 
      {path: 'contact',component: ContactComponent},            
      
    ]),
    JwtModule.forRoot({
      config:{
        tokenGetter:tokenGetter,
        whitelistedDomains:['localhost:3000'],
        blacklistedRoutes:['localhost:3000/logi']
      }
    })
    
    
  ],
  providers: [ DBService, 
    LoginService, 
    AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
