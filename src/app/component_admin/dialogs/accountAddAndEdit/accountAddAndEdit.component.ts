import { TokenStorageService } from './../../../guards/tokenStorage.service';
import { ConfirmedValidator, validateAllFormFields } from 'src/app/common/validators';
import { Component, Inject, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators, FormGroup, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { ValidationService } from 'src/app/services/validation.service';
import { shareReplay, Subscription, tap, mergeMap, filter, map, switchMap, timer, of, catchError, Observable } from 'rxjs';
import { GlobalUrl } from 'src/app/common/url';
import { SharedDataService } from 'src/app/services/sharedData.service';
import { AuthService } from 'src/app/guards/auth.service';

@Component({
  selector: 'app-accountAddAndEdit',
  templateUrl: './accountAddAndEdit.component.html',
  styleUrls: ['./accountAddAndEdit.component.css']
})
export class AccountAddAndEditComponent implements OnInit,OnDestroy {
  @ViewChildren('myCheckbox') private myCheckboxes !: QueryList<any>;
  baseHostImageUrl = GlobalUrl.baseHostImageUrl;
  selectedFiles: File[] = [];
  obs$!:Subscription;
  phoneByEdit!:string;
  emailByEdit!:string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {id: string},
    private fb: FormBuilder,
    private uploadService: FileUploadService,
    private rest:RestApiService,private message:AlertService,
    private validationService:ValidationService,
    private sharedData:SharedDataService,
    public auth:AuthService,
    public tokenStorage: TokenStorageService) { }
  previews:string[]=[];
  photoWhenEdit:string="";
  roles:any[]=[
    {id:"AD",name:"Admin"},
    {id:"GS",name:"Guest"},
    {id:"SP",name:"Shipper"},
    {id:"MN",name:"Manager"},
    {id:"CSM",name:"Customer"},
  ];

  rolesByEdit:string[]=[];
  action="";
  formAccount = this.fb.group({
    id:[''],
    name:['',[Validators.required,Validators.minLength(2),Validators.maxLength(30)]],
    email:['',Validators.compose([Validators.required,Validators.email,]),[this.validationService.isExistedEmail().bind(this)]],
    phone:['',Validators.compose([Validators.required,Validators.pattern(/0{1}[1-9]{1}[0-9]{8}$/)]),this.validationService.isExistedPhone().bind(this)],
    address:['',[Validators.maxLength(50)]],
    gender:[''],
    photo:[''],
    isDeleted:[false],
    memberShipID:[1],
    newPass:['',[Validators.required,Validators.minLength(6),Validators.maxLength(20)]],
    repeatNewPass:['',[Validators.required]],
    authority: this.fb.array([]),
  },{validator:ConfirmedValidator('newPass', 'repeatNewPass')})

  ngOnInit() {
    if(this.data.id ==='null'){
      this.action = "Add";
    }else{
      this.action = "Edit"

      console.log(this.data.id);
      this.patchValueForEditAction();
    }
    
  }
  patchValueForEditAction(){
    this.obs$ = this.rest.get(GlobalUrl.get_AllAccount_Admin).pipe(
      mergeMap((data:any) =>data),
      filter((e:any)=>e.id === this.data.id),
      map((data:any)=>{
        return{
          id:data.id,
          name:data.name,
          email:data.email,
          gender:data.gender,
          phone:data.phone,
          address:data.address,
          photo:data.photo,
          isDeleted:data.isDeleted,
          memberShipID:data.memberShip.id,
          authority:this.getAuthorityEditPatch(data.authorityDTO)
        }
      }),
      tap((e)=>console.log(e)),
      tap((e)=>{
        if(e.photo){
          this.previews.push(e.photo);
          this.photoWhenEdit = e.photo
        }
        this.formAccount.patchValue(e);
        e.authority.forEach((e:any)=>{
          //push to this array to set checked CheckBoxes
          this.rolesByEdit.push(e.id)
          this.formArrayRoles.push(
            this.fb.group({
              id:e.id,
            })
            )
          });
          //password can not update in edit mode
          this.newPass?.clearValidators();
          this.newPass?.updateValueAndValidity();
          this.repeatNewPass?.clearValidators();
          this.repeatNewPass?.updateValueAndValidity();
          
          this.phone?.clearAsyncValidators();
          this.phone?.updateValueAndValidity();
          this.email?.clearAsyncValidators();
          this.email?.updateValueAndValidity();
          
          this.phone?.setAsyncValidators([this.validationService.isExistedPhone_UpdateAccountAdmin(e.phone).bind(this)]);
          this.phone?.updateValueAndValidity();
          this.email?.setAsyncValidators([this.validationService.isExistedEmail_UpdateAccountAdmin(e.email).bind(this)]);
          this.email?.updateValueAndValidity();
      }),
    ).subscribe()
  }
  getAuthorityEditPatch(data:any){
    return data.map((item:any)=>{
      return {
        id:item.role.id
      }
    })
  }
  getAuthority(data:any){
    return data.map((item:any) => {
      return{
        role:{id:item.value.id},
        user:{id:null}
      }
    })
  }

  submit(){
    console.log(this.formAccount.value);
    if(this.formAccount.valid){
      if(this.action =='Add'){
        if(this.previews.length==0){
          let converter = {
            id:null,
            password:this.repeatNewPass?.value,
            name:this.name?.value,
            email:this.email?.value,
            phone:this.phone?.value,
            address:this.address?.value,
            gender:this.gender?.value,
            photo:null,
            isDeleted:false,
            memberShip:{id:this.memberShipID?.value},
            authorities:this.getAuthority(this.formArrayRoles.controls)
          }
          this.obs$ = this.rest.post(GlobalUrl.post_AddAccount_Admin,converter).subscribe((result)=>{
            this.message.successMessage("Thêm mới tài khoản thành công");
            this.resetForm();
            this.sharedData._sharedMessage("refresh");
          },(e)=>{
            this.message.errorMessage(e.message);
          });
          console.log(converter);
        }else{
          this.obs$ = this.uploadService.upload(this.selectedFiles).pipe(
            shareReplay(),
          ).subscribe((result) => {
            console.log(result[0]);
            
            let converter = {
              id:null,
              password:this.repeatNewPass?.value,
              name:this.name?.value,
              email:this.email?.value,
              phone:this.phone?.value,
              address:this.address?.value,
              gender:this.gender?.value,
              photo:result[0],
              isDeleted:false,
              memberShip:{id:this.memberShipID?.value},
              authorities:this.getAuthority(this.formArrayRoles.controls)
            }
            this.obs$ = this.rest.post(GlobalUrl.post_AddAccount_Admin,converter).subscribe((result)=>{
              this.message.successMessage("Thêm mới tài khoản thành công");
              this.resetForm();
              this.sharedData._sharedMessage("refresh");
            },(e)=>{
              this.message.errorMessage(e.message);
            });
            console.log(converter);
          })
        }
      }
      if(this.action == 'Edit'){
        
        console.log(this.selectedFiles);
        
        if(this.selectedFiles.length > 0){
          console.log("run");
          
          this.obs$ = this.uploadService.upload(this.selectedFiles).pipe(
            shareReplay(),
          ).subscribe((e)=>{
            let converter = {
              id:this.id?.value,
              name:this.name?.value,
              email:this.email?.value,
              phone:this.phone?.value,
              address:this.address?.value,
              gender:this.gender?.value,
              photo:e[0],
              isDeleted:false,
              memberShip:{id:this.memberShipID?.value},
              authorities:this.getAuthority(this.formArrayRoles.controls)
            }
            console.log(converter);
            
            this.rest.put(GlobalUrl.put_EditAccount_Admin,converter,this.id?.value).pipe(
              tap((e)=>console.log(e)),
              shareReplay(),
              tap((e)=>{
                this.message.successMessage("Cập nhật tài khoản thành công");
                this.sharedData._sharedMessage("refresh");
              }),
            ).subscribe()
          });
        }
        if((this.previews.length==0 && this.selectedFiles.length==0)||(this.previews.length>0 && this.selectedFiles.length==0)){
          console.log("ok");
          let converter = {
            id:this.id?.value,
            name:this.name?.value,
            email:this.email?.value,
            phone:this.phone?.value,
            address:this.address?.value,
            gender:this.gender?.value,
            photo:this.photoWhenEdit,
            isDeleted:false,
            memberShip:{id:this.memberShipID?.value},
            authorities:this.getAuthority(this.formArrayRoles.controls)
          }
          console.log(converter.photo);
          
          this.obs$ = this.rest.put(GlobalUrl.put_EditAccount_Admin,converter,this.id?.value).subscribe((result)=>{
            this.message.successMessage("Cập nhật tài khoản thành công");
            this.sharedData._sharedMessage("refresh");
          },(e)=>{
            this.message.errorMessage(e.message);
          });
          console.log(converter);
        }
      }
    }else{
      validateAllFormFields(this.formAccount);
    }
    
  }
  selectedFileAction:string = ''
  selectFiles(event:any){
    this.selectedFileAction = 'choosing';
    this.selectedFiles = event.target.files;
    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          // console.log(e.target.result);
          this.previews.push(e.target.result);
        };
        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }
  onCheckboxChange(e: any) {
    // const checkArray: FormArray = this.formAccount.get('checkArray') as FormArray;
    if (e.checked) {
      if(this.rolesByEdit.indexOf(e.source.value)>-1){

      }else{
        this.formArrayRoles.push(new FormControl({id:e.source.value}));
      }
    } else {
      let i: number = 0;
      this.formArrayRoles.controls.forEach((item: any) => {
        console.log(item.value);
        
        if (item.value.id == e.source.value) {
          this.formArrayRoles.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
  resetForm(){
    if(this.action==='Edit'){

    }else{
      this.formAccount.reset();
      this.formArrayRoles.reset();
      this.memberShipID?.setValue(1);
      this.uncheckedCheckBox();
    }
  }
  uncheckedCheckBox(){
    if(this.myCheckboxes){
      this.myCheckboxes.forEach(e=>{
        if(e.checked){
          e.checked = false;
        }
      })
    }
  }
  ngOnDestroy() {
    if(this.obs$){
      this.obs$.unsubscribe();
    }
  }
  get id(){return this.formAccount.get('id')};
  get name(){return this.formAccount.get('name')};
  get email(){return this.formAccount.get('email')};
  get phone(){return this.formAccount.get('phone')};
  get address(){return this.formAccount.get('address')};
  get gender(){return this.formAccount.get('gender')};
  get photo(){return this.formAccount.get('photo')};
  get isDeleted(){return this.formAccount.get('isDeleted')};
  get memberShipID(){return this.formAccount.get('memberShipID')};
  get newPass(){return this.formAccount.get('newPass')};
  get repeatNewPass(){return this.formAccount.get('repeatNewPass')};

  get formArrayRoles(){return this.formAccount.get('authority') as FormArray}

}
