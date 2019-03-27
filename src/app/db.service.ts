import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import {map} from 'rxjs/operators'; 
import 'rxjs/add/operator/map';
import { HttpParams, HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DBService {

  news: any[];
  users: any[];
  inquiries: any[];

  constructor(private http:Http,
    private router:Router) { }

  private newsUrl='http://localhost:3000/new';
  private latestNewsUrl='http://localhost:3000/latestNews'
  private userUrl='http://localhost:3000/user';
  private inquiryUrl='http://localhost:3000/inquiry';
  

  //news collection
  getNews(){
    return this.http.get(this.newsUrl);
  }

  addNews(credentials){
    return this.http.post('http://localhost:3000/postNews', credentials);
  }

  getLatestNews(){
    return this.http.get(this.latestNewsUrl);
  }


  //user collection
  getUsers(){
    return this.http.get(this.userUrl);
  }

  //inquiry collection
  getInquiries(){
    return this.http.get(this.inquiryUrl);
  }

  getUserInquiries(info){
    //console.log(info);
    
    return this.http.post('http://localhost:3000/userInquiries',info);
  }

  addInquiry(info){
    return this.http.post('http://localhost:3000/sendInquiry', info);
  
  }

  deleteInquiry(post){
    return this.http.post('http://localhost:3000/deletePost',post);
  }

  replyInquiry(reply){
    return this.http.post('http://localhost:3000/sendReply',reply);
  }



}
