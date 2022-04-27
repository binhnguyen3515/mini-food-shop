import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription, tap } from 'rxjs';
import { GlobalUrl } from 'src/app/common/url';
import { validateAllFormFields } from 'src/app/common/validators';
import { AuthService } from 'src/app/guards/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-forgotPass',
  templateUrl: './forgotPass.component.html',
  styleUrls: ['./forgotPass.component.css']
})
export class ForgotPassComponent implements OnInit,OnDestroy {

  obs$!:Subscription;
  formForgotPass = this.fb.group({
    email:['',[Validators.required,Validators.maxLength(50),Validators.email]]
  })
  constructor(private fb:FormBuilder,private message:AlertService,private auth:AuthService) { }
  
  ngOnInit() {
  }
  loadingStatus = false;
  submit(){
    console.log(this.formForgotPass.value);
    if(this.formForgotPass.valid){
      this.loadingStatus = true;
      if(this.loadingStatus == true){
        this.message.loadingMessage("Hệ thống đang xử lý");
      }
      this.obs$ = this.auth.forgotPass(this.formForgotPass.value).pipe(
        tap((e:any)=>{
          this.loadingStatus = false;
          if(e.message === 'Email is not existed!'){
            this.message.warningMessage("Email không tồn tại!");
          }
          if(e.message === 'Sended new password to email succeed'){
            this.message.successMessage("Mật khẩu đã được khôi phục, bạn vui lòng kiểm tra email!");
            this.formForgotPass.reset();
          }
          if(e.message === 'Error!!!'){
            this.message.errorMessage("Email không tồn tại!");
          }
        })
      ).subscribe()
      // this.message.successMessage("Mật khẩu đã được khôi phục, bạn vui lòng kiểm tra email!");
      // this.formForgotPass.reset();
    }else{
      validateAllFormFields(this.formForgotPass);
    }
  }
  get email() { return this.formForgotPass.get('email')};

  ngOnDestroy(): void {
    if(this.obs$){
      this.obs$.unsubscribe();
    }
  }
}
