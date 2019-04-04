import { Http } from '@angular/http';
import { LoginService } from './../login.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import "rxjs/add/observable/from";

describe('RegisterComponent', () => {
  // let component: RegisterComponent;
  // let fixture: ComponentFixture<RegisterComponent>;

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     declarations: [ RegisterComponent ]
  //   })
  //   .compileComponents();
  // }));

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(RegisterComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
  let component:RegisterComponent;
  let loginService:LoginService;
  let router:Router;
  let http:Http;


  beforeEach(()=>{
    loginService=new LoginService(http,router);
    component= new RegisterComponent(router, loginService);

  });

  it('should disallow duplicate usernames',()=>{
    spyOn(loginService,'register').and.callFake(()=>{
      return Observable.from([{response:500}]);

    });
    //calling method
    component.register({
      username:'Mr. Eman',
      firstName:'m',
      surname:'l',
      type:'Rider',
      password:'a',
      password2:'a'
    });

    //expect
    expect(component.result).toEqual({response:500});


  });

  it('should allow unique usernames',()=>{
    spyOn(loginService,'register').and.callFake(()=>{
      return Observable.from([{response:200}]);

    });
    //calling method
    component.register({
      username:'an',
      firstName:'m',
      surname:'l',
      type:'Rider',
      password:'a',
      password2:'a'
    });

    //expect
    expect(component.result).toEqual({response:200});
  });

  it('should invalidate register requests if any fields are null',()=>{
    // //calling method
    component.checkValid({
      username:'an',
      firstName:'',
      surname:'l',
      type:'Rider',
      password:'a',
      password2:'a'
    });

    expect(component.invalidLogin).toBe(true);
  });

  it('should validate register requests if all fields are not null',()=>{
    // //calling method
    component.checkValid({
      username:'an',
      firstName:'a',
      surname:'l',
      type:'Rider',
      password:'a',
      password2:'a'
    });

    expect(component.invalidLogin).toBe(false);
  });

  



});
