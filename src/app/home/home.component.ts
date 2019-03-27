import { LoginService } from './../login.service';
import { DBService } from './../db.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  news: any[];
  users: any[];
  inquiries: any[];

  ngOnInit(){
    this.service.getLatestNews().subscribe(res =>{
      
      this.news=res.json();
    });
    this.service.getUsers().subscribe(res =>{
      this.users=res.json();
    });
    this.service.getInquiries().subscribe(res =>{
      this.inquiries=res.json();
    });
    //console.log(this.loginService.currentUser);
    
  }

  constructor(private service:DBService,
    ) { }

  
}
