import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from './tokenStorage.service';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private token:TokenStorageService) {}


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authReq = request;
    const token = this.token.getToken();
    
    if(token!=null){
      let headers = request.headers
        .append(TOKEN_HEADER_KEY,'Bearer '+token)
        .append('UserId',this.token.getUser().id.toString());
      // authReq = request.clone({headers: request.headers.set(TOKEN_HEADER_KEY,'Bearer '+token)})
      authReq = request.clone({headers:headers})
      console.log(this.token.getUser());
      
      console.log(token);
      
    }
    return next.handle(authReq);
  }
}
export const authInterceptorProviders = [
  {provide:HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true},
]