import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private loginService:LoginService) { }

  ngOnInit() {
    console.log(this.loginService.currentUser);
    

  }

  logout(){
    this.loginService.logout();
  }

}
