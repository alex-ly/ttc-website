import { LoginService } from './../login.service';
import { DBService } from './../db.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-news',
  templateUrl: './post-news.component.html',
  styleUrls: ['./post-news.component.css']
})
export class PostNewsComponent{

  constructor(private router:Router,
    private dbService:DBService,
    private loginService:LoginService) { }

  submit(info){
    info['username']=this.loginService.currentUser.username;
    this.dbService.addNews(info).subscribe(result=>{
      if (result){
        //console.log(this.loginService.currentUser);
        
        this.router.navigate(['/']);
      }else{
        this.router.navigate(['/postNews']);
      }

    });
  }
}
