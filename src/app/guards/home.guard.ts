import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class HomeGuard implements CanActivate {
  constructor(private auth:AuthService,private message: AlertService,
    private router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(!this.auth.isLoggedIn()){
        this.message.warningMessage("Bạn chưa đăng nhập!");
        this.router.navigate(['/home/login']);
      }
    return this.auth.isLoggedIn();
  }
}
