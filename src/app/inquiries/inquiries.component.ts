import { LoginService } from './../login.service';
import { DBService } from './../db.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inquiries',
  templateUrl: './inquiries.component.html',
  styleUrls: ['./inquiries.component.css']
})
export class InquiriesComponent implements OnInit {
  inquiries:any[];
  userInquiries:any[];

  constructor(private service:DBService,
    private router:Router,
    private loginService:LoginService) { }

  ngOnInit() {
    this.service.getInquiries().subscribe(res =>{
      this.inquiries=res.json();
    });

    this.service.getUserInquiries(this.loginService.currentUser).subscribe(res =>{
      this.userInquiries=res.json();

    });

  }

  delete(post){
    console.log(post);
    
    this.service.deleteInquiry(post).subscribe(result=>{
      console.log(result);
      this.ngOnInit();
      
      this.router.navigate(['/inquiries']);
      
    });
    //this.router.navigate(['/']);
      
  }

  isEmpty(list){
    //console.log(list);
    
    if(!list || list.length==0)return true;
    return false;
  }

  replyPost(input:HTMLInputElement,post){
    console.log(post);
    
    let reply={
      username:this.loginService.currentUser.username,
      id:post._id,
      comment:input.value
    }
    console.log(reply);
    
    this.service.replyInquiry(reply).subscribe(result=>{
      console.log(result);
      this.ngOnInit();
      
      this.router.navigate(['/inquiries']);
      
    });

  }

  // emptyReplies(post){
  //   if (post.replies.length==0) return true;
  //   return false;
  // }

  // noInquiry(){
  //   //console.log(this.userInquiries);
    
  //   if(this.userInquiries==[]) return true;
  //   return false;
  // }

  isActive(post){
    if(post.active) return true;
    return false;
  }

}
