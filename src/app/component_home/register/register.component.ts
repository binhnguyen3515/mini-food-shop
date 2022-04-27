import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalUrl } from 'src/app/common/url';
import { validateAllFormFields } from 'src/app/common/validators';
import { AuthService } from 'src/app/guards/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit,OnDestroy {
  formRegister = this.fb.group({
    name:['',[Validators.required,Validators.minLength(2),Validators.maxLength(30)]],
    phone:['',Validators.compose([Validators.required,Validators.pattern(/0{1}[1-9]{1}[0-9]{8}$/)]),this.validationService.isExistedPhone().bind(this)],
    email:['',Validators.compose([Validators.required,Validators.email]),this.validationService.isExistedEmail().bind(this)],
    password:['',[Validators.required,Validators.minLength(6),Validators.maxLength(20)]]
  })
  constructor(private fb:FormBuilder,private message:AlertService,
    private validationService:ValidationService,private rest:RestApiService,
    private router:Router,private auth:AuthService) { }
  
  registerAccount$!:Subscription;
  ngOnInit() {
  }
  submit(){
    // console.log(JSON.stringify(this.formRegister.value));
    
    if(this.formRegister.valid){
      this.registerAccount$ = this.auth.register(this.formRegister.value).subscribe(data=>{
        this.message.successMessage("Đăng ký tài khoản thành công!");
        this.formRegister.reset();
        this.router.navigate(['/home/login'])
      },(err) => {
        console.log(err.message);
      })
      // this.registerAccount$ = this.rest.post(GlobalUrl.post_signUp,this.formRegister.value).subscribe(data => {
      //   this.message.successMessage("Đăng ký tài khoản thành công!");
      //   this.formRegister.reset();
      //   this.router.navigate(['/home/login'])
      // },(err) => {
      //   console.log(err.message);
      // })
    }else{
      validateAllFormFields(this.formRegister);
    }
  }
  get name() { return this.formRegister.get('name')};
  get phone() { return this.formRegister.get('phone')};
  get email() { return this.formRegister.get('email')};
  get password() { return this.formRegister.get('password')};

  ngOnDestroy(): void {
    if(this.registerAccount$){
      this.registerAccount$.unsubscribe();
    }
  }
}
