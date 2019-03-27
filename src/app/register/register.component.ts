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
  type:string;


  constructor(private router:Router,
    private loginService:LoginService) { }


  register(credentials){
    this.checkValid(credentials);
    if(!this.invalidLogin){
      this.loginService.register(credentials)
    
      .subscribe(result => { 
        if (result){
          //console.log(this.loginService.currentUser);
          
          this.router.navigate(['/']);
        }else  
          this.invalidLogin = true; 
      });


    }
    
    
    
  }

  checkAdmin(){
    console.log(this.type);
    
    if(this.type=='Admin'){
      this.admin=true;
    }else{
      this.admin=false;
    }

  }

  checkValid(credentials){
    if(credentials.username=="" 
    || credentials.firstName==""
    || credentials.surname==""
    || credentials.password==""
    || this.type==""){
      //console.log('hi');
      
      this.invalidLogin=true;
    }else{
      this.invalidLogin=false;
    }

  }

    
  

}
