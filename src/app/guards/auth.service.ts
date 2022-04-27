import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { GlobalUrl } from 'src/app/common/url';
import { RestApiService } from '../services/rest-api.service';
import { TokenStorageService } from './tokenStorage.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService,private rest:RestApiService
  ) {}
  login({ username, password }: any): Observable<any> {
    return this.http.post(
      GlobalUrl.post_signIn,
      { username, password },
      httpOptions
    );
  }
  logout() {
    this.rest.get(GlobalUrl.get_logout).pipe(
      tap((e)=>console.log(e)),
      map((data:any)=>{
        if(data.message ==='ok'){
          this.tokenStorage.signOut();
          console.log(true);
        }else{
          console.log(false);
        }
      }),
      shareReplay(),
      ).subscribe();
    
  }
  register({
    name,
    phone,
    email,
    password
  }: any): Observable<any> {
    return this.http.post(
      GlobalUrl.post_signUp,
      { name, phone, email, password},
      httpOptions
    );
  }

  update({
    id,
    password,
    name,
    email,
    phone,
    photo,
    role,
    memberShip
  }: any): Observable<any> {
    return this.http.put(
      GlobalUrl.baseUrl + 'rest/auth/update/'+id,
      { password ,name, email, phone , photo ,role, memberShip},
      httpOptions
    );
  }

  updateProfile({
    id,gender,name,phone,email,address,photo
  }:any):Observable<any> {
    return this.http.put(GlobalUrl.put_update_profile+id,
      {id,gender,name,phone,email,address,photo},httpOptions);
  }
  

  // updatePassword({
  //   id,password
  // }:any):Observable<any> {
  //   return this.http.put(GlobalUrl.put_update_password+id,
  //     password,httpOptions);
  // }
  updatePassword({
    id,password
  }:any):Observable<any> {
    return this.http.put(GlobalUrl.put_update_password+id,
      password,httpOptions);
  }

  forgotPass({
    email
  }:any):Observable<any> {
    return this.http.post(GlobalUrl.post_forgot_password,
      email,httpOptions);
  }
  getAll(): Observable<any>{
    return this.http.get(GlobalUrl.baseUrl+"rest/auth/getAll",httpOptions);
  }

  accountRequestByUsername(username: string): Observable<any>{
    return this.http.get(GlobalUrl.baseUrl+"rest/auth/getOne/"+username,httpOptions);
  }

  isLoggedIn() {
    return this.tokenStorage.getToken()!==null;
    // return false;
  }

  isCustomer(){
    return this.isLoggedIn() && this.tokenStorage.getUser().roles.indexOf("customer")>-1;
  }

  isAdmin(){
    return this.isLoggedIn() && this.tokenStorage.getUser().roles.indexOf("admin")>-1;
  }

  isManager(){
    return this.isLoggedIn() && this.tokenStorage.getUser().roles.indexOf("manager")>-1;
  }

  isShipper(){
    return this.isLoggedIn() && this.tokenStorage.getUser().roles.indexOf("shipper")>-1;
  }

  isAdminOrManager(){
    return this.isAdmin() || this.isManager();
  }

  isAdminOrStaff(){
    return this.isAdmin() || this.isManager() || this.isShipper();
  }
}
