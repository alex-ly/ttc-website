import { DBService } from './../db.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  news:any[];

  constructor(private service:DBService) { }

  ngOnInit() {
    this.service.getNews().subscribe(res =>{
      console.log(res.json());
      
      this.news=res.json();
    });
  }

}
