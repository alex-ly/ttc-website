import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  invalidLogin:boolean;

  constructor(private router:Router,
    private loginService:LoginService) { }

    signIn(credentials) {
      console.log(`Credentials: `+JSON.stringify(credentials));
      console.log(credentials);
      
      
      //this.loginService.login(JSON.stringify(credentials))
      this.loginService.login(credentials)
      
        .subscribe(result => { 
          if (result){
            //console.log(this.loginService.currentUser);
            
            this.router.navigate(['/']);
          }else  
            this.invalidLogin = true; 
        });
    }

  
}
