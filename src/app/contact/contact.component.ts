import { DBService } from './../db.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent{

  constructor(private router:Router,
    private dbService:DBService) { }

  submit(info){
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
