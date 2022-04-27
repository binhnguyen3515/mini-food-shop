import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, shareReplay, Subscription, tap } from 'rxjs';
import { GlobalUrl } from 'src/app/common/url';
import { ConfirmedValidator, validateAllFormFields } from 'src/app/common/validators';
import { AuthService } from 'src/app/guards/auth.service';
import { TokenStorageService } from 'src/app/guards/tokenStorage.service';
import { AlertService } from 'src/app/services/alert.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { ValidationService } from 'src/app/services/validation.service';
import { SharedDataService } from 'src/app/shared/sharedData.service';

@Component({
  selector: 'app-edit_profile',
  templateUrl: './edit_profile.component.html',
  styleUrls: ['./edit_profile.component.css']
})
export class Edit_profileComponent implements OnInit,OnDestroy {
  updatePassword_data_Send$:any;
  selectedFiles?: File[];
  formUpdateProfile = this.fb.group({
    id:[''],
    gender:[''],
    name:['',[Validators.required,Validators.minLength(2),Validators.maxLength(30)]],
    phone:['',Validators.compose([Validators.required,Validators.pattern(/0{1}[1-9]{1}[0-9]{8}$/)]),this.validationService.isExistedPhone_UpdateProfile().bind(this)],
    email:['',Validators.compose([Validators.required,Validators.email,]),[this.validationService.isExistedEmail_UpdateProfile().bind(this)]],
    address:['',[Validators.maxLength(60)]],
    photo:['']
  })
  
  formUpdatePassword = this.fb.group({
    id:[''],
    currentPass:['',[Validators.required]],
    newPass:['',[Validators.required,Validators.minLength(6),Validators.maxLength(20)]],
    repeatNewPass:['',[Validators.required]]
  },
  {validator:ConfirmedValidator('newPass', 'repeatNewPass')}
  )
  constructor(private fb: FormBuilder,
    private message:AlertService,
    private validationService:ValidationService,
    private auth:AuthService,private sharedData:SharedDataService,
    private route:Router,private tokenStorage:TokenStorageService,
    private rest:RestApiService,
    private uploadService:FileUploadService) { }
  
  obs$!:Subscription;
  ngOnInit() {
    console.log(this.tokenStorage.getUser());
    
    if(this.auth.isLoggedIn()){
      this.id?.setValue(this.tokenStorage.getUser().id);
      this.id_passwordForm?.setValue(this.tokenStorage.getUser().id);
      this.formUpdateProfile.patchValue(this.tokenStorage.getUser());
    }
  }
  submitProfile(){
    // console.log(this.formUpdateProfile.value);
    if(this.formUpdateProfile.valid){
      if(this.selectedFiles!==undefined){
        this.obs$ = this.uploadService.upload(this.selectedFiles).pipe(shareReplay())
        .subscribe((result) => {
          console.log(result[0]);
          // this.photo?.setValue(result[0]);
          this.formUpdateProfile.get('photo')?.setValue(result[0]);
          console.log(this.formUpdateProfile.value);
          
          this.auth.updateProfile(this.formUpdateProfile.value)
          .subscribe(data=>{
            console.log(data);
            this.message.successMessage("Cập nhật thông tin cá nhân thành công!");
            this.formUpdateProfile.reset();
            this.logout();
          },err=>this.message.errorMessage(err.message))  
        })
      }else{
        this.formUpdateProfile.get('photo')?.setValue("empty");
        this.auth.updateProfile(this.formUpdateProfile.value)
        .subscribe(data=>{
          console.log(data);
          this.message.successMessage("Cập nhật thông tin cá nhân thành công!");
          this.formUpdateProfile.reset();
          this.logout();
        },err=>this.message.errorMessage(err.message))  
        
      }
      // this.uploadService.uploadOneFile(this.)
      // this.obs$ = this.auth.updateProfile(this.formUpdateProfile.value)
      // .subscribe(data=>{
      //   console.log(data);
      //   this.message.successMessage("Cập nhật thông tin cá nhân thành công!");
      //   this.formUpdateProfile.reset();
      //   this.logout();
      // },err=>this.message.errorMessage(err.message))
    }else{
      validateAllFormFields(this.formUpdateProfile);
    }
  }
  selectFiles(event: any): void {  
    this.selectedFiles = event.target.files;
    console.log(this.selectedFiles);
    // this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
        // reader.onload = (e: any) => {
        //   // console.log(e.target.result);
        //   this.previews.push(e.target.result);
        // };
        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }
  submitUpdatePassword(){
    console.log(this.formUpdatePassword.value);
    
    if(this.formUpdatePassword.valid){
      this.updatePassword_data_Send$ = {
        id:1,
        password:this.repeatNewPass?.value
      }
      console.log(JSON.stringify(this.updatePassword_data_Send$));
      this.obs$ = this.rest.post(GlobalUrl.post_isMatchedPassword+"/"+this.tokenStorage.getUser().id,this.currentPass?.value)
      .pipe(map((data: any)=>{
        let ms = (data as any).message
        if(ms ==='Matched'){
          this.updatePassword();
        }else{
          this.message.warningMessage("Mật khẩu cũ không chính xác!");
        }
      })).subscribe()
    }else{
      validateAllFormFields(this.formUpdatePassword);
    }
  }
  updatePassword(){
    this.auth.updatePassword({id:this.id_passwordForm?.value,password:this.newPass?.value})
    // .pipe(tap(() => this.message.successMessage("Cập nhật mật khẩu thành công!")))
    .subscribe((data) =>{
      this.message.successMessage("Cập nhật mật khẩu thành công!")
      // this.formUpdateProfile.reset();
      // this.logout();
    })

  }
  logout(){
    this.auth.logout();
    this.route.navigate(['home/login']);
    // this.sharedData.changeData("Bạn");
  }
  get id(){ return this.formUpdateProfile.get('id')};
  get gender(){ return this.formUpdateProfile.get('gender')};
  get name(){ return this.formUpdateProfile.get('name')};
  get phone(){ return this.formUpdateProfile.get('phone')};
  get email(){ return this.formUpdateProfile.get('email')};
  get address(){ return this.formUpdateProfile.get('address')};
  get photo(){ return this.formUpdateProfile.get('photo')};

  get id_passwordForm(){ return this.formUpdatePassword.get('id')}
  get currentPass(){ return this.formUpdatePassword.get('currentPass')};
  get newPass(){ return this.formUpdatePassword.get('newPass')};
  get repeatNewPass(){ return this.formUpdatePassword.get('repeatNewPass')};

  ngOnDestroy() {
    if(this.obs$){
      this.obs$.unsubscribe();
    }
  }
}
