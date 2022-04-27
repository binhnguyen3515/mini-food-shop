import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAndManagerGuard implements CanActivate {
  constructor(private auth:AuthService,private message: AlertService,
    private router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(!this.auth.isAdminOrManager()){
        this.message.warningMessage("Chỉ có manager hoặc admin mới được truy cập vào đường dẫn này!");
        this.router.navigate(['/admin/invoice']);
      }
    return this.auth.isAdminOrManager();
  }
  
}
