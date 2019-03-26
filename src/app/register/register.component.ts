import { LoginService } from './../login.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  invalidLogin:boolean;
  admin:boolean;


  constructor(private router:Router,
    private loginService:LoginService) { }


  register(credentials){
    this.loginService.register(credentials)
      
        .subscribe(result => { 
          if (result){
            //console.log(this.loginService.currentUser);
            
            this.router.navigate(['/']);
          }else  
            this.invalidLogin = true; 
        });
    }

  checkAdmin(input:HTMLInputElement){
    if(input.value=='admin'){
      this.admin=true;
    }else{
      this.admin=false;
    }

  }

    
  

}
