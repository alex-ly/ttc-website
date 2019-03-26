import { DBService } from './../db.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inquiries',
  templateUrl: './inquiries.component.html',
  styleUrls: ['./inquiries.component.css']
})
export class InquiriesComponent implements OnInit {
  inquiries:any[];

  constructor(private service:DBService) { }

  ngOnInit() {
    this.service.getInquiries().subscribe(res =>{
      this.inquiries=res.json();
    });
    
  }

}
