import { LoginService } from './../login.service';
import { DBService } from './../db.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent{

  invalid:boolean;

  constructor(private router:Router,
    private dbService:DBService,
    private loginService: LoginService) { }

  submit(info){
    this.checkValid(info);
    if(!this.invalid){
      info['username']=this.loginService.currentUser.username;
      console.log(info);
      
    
      this.dbService.addInquiry(info).subscribe(result=>{
        if (result){
          //console.log(this.loginService.currentUser);
          
          this.router.navigate(['/']);
        }else{
          this.router.navigate(['/contact']);
        }

      });
    }
  }

  checkValid(credentials){
    console.log(credentials);
    
    if(credentials.subject=="" 
    || credentials.content==""){
      //console.log('hi');
      
      this.invalid=true;
    }else{
      this.invalid=false;
    }
  
  }
}



