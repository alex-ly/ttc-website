import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { tokenNotExpired, JwtHelper } from "angular2-jwt";
import {map} from 'rxjs/operators'; 
import 'rxjs/add/operator/map';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // private loggedIn:boolean;
  currentUser:any;
  admin:boolean;

  constructor(private http:Http, private router:Router) { 
    let token=localStorage.getItem('token');
    if(token){
      let jwt=new JwtHelper();
      this.currentUser = jwt.decodeToken(token);
      console.log(this.currentUser);
      
    }
  }

  login(credentials) { 
    //return this.http.post('/api/authenticate', JSON.stringify(credentials));
    console.log(credentials);
    
    //console.log(JSON.stringify(credentials));
    let params = new HttpParams();
    params = params.append('var1', credentials.username);
    params = params.append('var2', credentials.password);
    console.log(params);
    

    
    //return this.http.get('http://localhost:3000/login1', JSON.stringify(credentials))
    return this.http.post('http://localhost:3000/log', credentials)
    
    //return this.http.get('http://localhost:3000/login1',{params:params})
      //.subscribe((response:Response)=>{
     .pipe(map(response => {
       let result = response.json();
       console.log(result);
       
       
       if (result && result.token) {
         localStorage.setItem('token', result.token);
 
         let jwt = new JwtHelper();
         this.currentUser = jwt.decodeToken(localStorage.getItem('token'));
         if(this.currentUser.admin){
           this.admin=true;
         }else{
           this.admin=false;
         }
         console.log(this.currentUser);
         
 
         return true; 
       }
       else return false; 
     }));

    //return this.http.get('http://localhost:3000/login1',{params:params});
   }

  register(credentials){
    return this.http.post('http://localhost:3000/register', credentials)    
     .pipe(map(response => {
       let result = response.json();
       console.log(result);
       
       
       if (result && result.token) {
         localStorage.setItem('token', result.token);
 
         let jwt = new JwtHelper();
         this.currentUser = jwt.decodeToken(localStorage.getItem('token'));
         if(this.currentUser.admin){
           this.admin=true;
         }else{
           this.admin=false;
         }
         console.log(this.currentUser);
         
 
         return true; 
       }
       else return false; 
     }));

    
  }

  

  logout(){
    localStorage.removeItem('token');
    this.currentUser=null;
    this.admin=false;

    this.router.navigate(['/']);
  }

  getLoggedIn(){
    return tokenNotExpired('token');
  }

  getAdmin(){
    if(this.currentUser==null) return false;
    return this.currentUser.admin;
  }
}
