import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(protected router:Router, protected loginService:LoginService) { }

  canActivate(){
    if (this.loginService.getLoggedIn()) return true;

    this.router.navigate(['/login']);
    return false;

  }
}
