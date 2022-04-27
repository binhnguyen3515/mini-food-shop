import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { validateAllFormFields, ValidatePhone } from 'src/app/common/validators';
import { AuthService } from 'src/app/guards/auth.service';
import { TokenStorageService } from 'src/app/guards/tokenStorage.service';
import { AlertService } from 'src/app/services/alert.service';
import { SharedDataService } from 'src/app/shared/sharedData.service';

@Component({
  selector: 'app-secondLogin',
  templateUrl: './secondLogin.component.html',
  styleUrls: ['./secondLogin.component.css']
})
export class SecondLoginComponent implements OnInit,OnDestroy {
  
  loginForm = this.fb.group({
    username:['',[Validators.required,ValidatePhone]],
    password:['',[Validators.required,Validators.minLength(6),Validators.maxLength(20)]]
  });
  constructor(private fb:FormBuilder,private auth:AuthService,
    private tokenStorage: TokenStorageService,private message:AlertService,
    private sharedData:SharedDataService,private route:Router) { }
  obs$!:Subscription;
  ngOnInit() {
  }

  onSubmit(){
    // console.log(JSON.stringify(this.loginForm.value));
    if(this.loginForm.valid){
      this.obs$ = this.auth.login(this.loginForm.value).pipe(
       map((data:any)=>{
          if(data.message === 'Wrong'){
            this.message.warningMessage(`Tài khoản không tồn tại`);
            return;
          }
          if(data.message === 'Error'){
            this.message.errorMessage(`Lỗi`);
            return;
          }
          if(data.message === 'Account is blocked'){
            this.message.warningMessage(`Tài khoản đang bị khoá, vui lòng liên hệ Admin để biết thêm chi tiết!`);
            return;
          }
          // console.log(data.token);
          this.tokenStorage.saveToken(data.token);
          this.tokenStorage.saveUser(data);
          console.log(data);
          
          this.message.successMessage(`Đăng nhập thành công`);
          // this.changeName();
          this.route.navigate(['home/product']);
       })
      ).subscribe();
    }else{
      validateAllFormFields(this.loginForm);
    }
    
  }
  // changeName(){
  //   if(this.tokenStorage.getUser()){
  //     this.sharedData.changeData(this.tokenStorage.getUser().phone);
  //   }
  // }
  get username(){return this.loginForm.get('username');}
  get password(){return this.loginForm.get('password');}

  ngOnDestroy() {
    if(this.obs$){
      this.obs$.unsubscribe();
    }
  }
}
