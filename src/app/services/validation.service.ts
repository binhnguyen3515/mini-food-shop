import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { catchError, map, Observable, of, switchMap, tap, timer } from 'rxjs';
import { GlobalUrl } from '../common/url';
import { TokenStorageService } from '../guards/tokenStorage.service';
import { RestApiService } from './rest-api.service';
@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  constructor(private rest: RestApiService,private tokenStorage: TokenStorageService) {}
  
  isExistedPhone():AsyncValidatorFn{
    return (control:AbstractControl):Observable<ValidationErrors | null>=>{
      return timer(300).pipe(
        switchMap(()=>
          this.rest.post(GlobalUrl.post_isExistedPhone,control.value).pipe(
          // this.rest.post(GlobalUrl.post_isExistedPhone,status:control.value).pipe(
            map((isValid:any) =>{    
              if(isValid.message == 'Phone is existed!'){
                return {existedPhone:true};
              }
              return null;
            })
          )
        ),
        catchError((e,c) =>of())
      )
    }
  }
  isExistedPhone_UpdateProfile():AsyncValidatorFn{
    return (control:AbstractControl):Observable<ValidationErrors | null>=>{
      return timer(300).pipe(
        switchMap(()=>
          this.rest.post(GlobalUrl.post_isExistedPhone,control.value).pipe(
          // this.rest.post(GlobalUrl.post_isExistedPhone,status:control.value).pipe(
            map((isValid:any) =>{  
              if(isValid.message == 'Phone is existed!' && this.tokenStorage.getUser().phone===control.value){
                return null
              }  
              if(isValid.message == 'Phone is existed!' && this.tokenStorage.getUser().phone!==control.value){
                return {existedPhone:true};
              }
              return null;
            })
          )
        ),
        catchError((e,c) =>of())
      )
    }
  }
  isExistedEmail():AsyncValidatorFn{
    return (control:AbstractControl):Observable<ValidationErrors | null>=>{
      return timer(300).pipe(
        switchMap(()=>
          this.rest.post(GlobalUrl.post_isExistedEmail,control.value).pipe(
          // this.rest.post(GlobalUrl.post_isExistedEmail,control.value).pipe(
            map((isValid:any) =>{
              if(isValid.message == 'Email is existed!'){
                return {existedEmail:true};
              }
              return null;
            })
            
          )
        ),
        catchError((e,c) =>of())
      )
    }
  }
  isExistedEmail_UpdateProfile():AsyncValidatorFn{
    return (control:AbstractControl):Observable<ValidationErrors | null>=>{
      return timer(300).pipe(
        switchMap(()=>
          this.rest.post(GlobalUrl.post_isExistedEmail,control.value).pipe(
          // this.rest.post(GlobalUrl.post_isExistedEmail,control.value).pipe(
            map((isValid:any) =>{
              if(isValid.message == 'Email is existed!' && this.tokenStorage.getUser().email === control.value){
                return null;
              }
              if(isValid.message == 'Email is existed!' && this.tokenStorage.getUser().email !== control.value){
                return {existedEmail:true};
              }
              return null;
            })
            
          )
        ),
        catchError((e,c) =>of())
      )
    }
  }
  isMatchedPassword():AsyncValidatorFn{
    return (control:AbstractControl):Observable<ValidationErrors | null>=>{
      return timer(300).pipe(
        switchMap(()=>
          this.rest.post(GlobalUrl.post_isMatchedPassword,control.value).pipe(
          // this.rest.post(GlobalUrl.post_isExistedEmail,control.value).pipe(
            map((isValid:any) =>{
              if(isValid.message !== 'Matched!'){
                return {matchedPassword:true};
              }
              return null;
            })
            
          )
        ),
        catchError((e,c) =>of())
      )
    }
  }
  isExistedImportID():AsyncValidatorFn{
    return (control:AbstractControl):Observable<ValidationErrors | null>=>{
      return timer(300).pipe(
        switchMap(()=>
          this.rest.post(GlobalUrl.post_isExistedImportID,control.value).pipe(
          // this.rest.post(GlobalUrl.post_isExistedEmail,control.value).pipe(
            map((isValid:any) =>{
              if(isValid.message == 'ImportID is existed!'){
                return {existedImportID:true};
              }
              return null;
            })
            
          )
        ),
        catchError((e,c) =>of())
      )
    }
  }
  isExistedPhone_UpdateAccountAdmin(phone: string):AsyncValidatorFn{
    return (control:AbstractControl):Observable<ValidationErrors | null>=>{
      return timer(300).pipe(
        switchMap(()=>
          this.rest.post(GlobalUrl.post_isExistedPhone,control.value).pipe(
          // this.rest.post(GlobalUrl.post_isExistedPhone,status:control.value).pipe(
            map((isValid:any) =>{  
              if(isValid.message == 'Phone is existed!' && phone===control.value){
                return null
              }  
              if(isValid.message == 'Phone is existed!' && phone!==control.value){
                return {existedPhone:true};
              }
              return null;
            })
          )
        ),
        catchError((e,c) =>of())
      )
    }
  }
  isExistedEmail_UpdateAccountAdmin(email: string):AsyncValidatorFn{
      return (control:AbstractControl):Observable<ValidationErrors | null>=>{
        return timer(300).pipe(
          switchMap(()=>
            this.rest.post(GlobalUrl.post_isExistedEmail,control.value).pipe(
            // this.rest.post(GlobalUrl.post_isExistedEmail,control.value).pipe(
              map((isValid:any) =>{
                if(isValid.message == 'Email is existed!' && email === control.value){
                  return null;
                }
                if(isValid.message == 'Email is existed!' && email !== control.value){
                  return {existedEmail:true};
                }
                return null;
              })
              
            )
          ),
          catchError((e,c) =>of())
        )
      }
    }
  // checkPhoneNotTaken(){
  //   this.rest.get('https://mini-food-shop-testing-default-rtdb.firebaseio.com/status.json').pipe(
  //     delay(1000)
  //   ).subscribe((data) => {
  //     console.log(data);
  //     return data;
  //   })
  //   return null;
  // }
  // isExistedPhonetext() {
  //   return this.rest.get('https://mini-food-shop-testing-default-rtdb.firebaseio.com/status.json').subscribe((data)=>{
  //    console.log(data);
  //    if(data == 'existed'){
  //      return {existedPhone:true}
  //    }
  //    return null;
  //   })
  //  }
}
