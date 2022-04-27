import { filter, mergeMap, pluck, shareReplay, Subscription, toArray, tap, map, Subject } from 'rxjs';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestApiService } from 'src/app/services/rest-api.service';
import { GlobalUrl } from 'src/app/common/url';
import { FormBuilder, Validators } from '@angular/forms';
import { validateAllFormFields } from 'src/app/common/validators';
import { AlertService } from 'src/app/services/alert.service';
import { SharedDataService } from 'src/app/services/sharedData.service';

@Component({
  selector: 'app-importEditDialog',
  templateUrl: './importEditDialog.component.html',
  styleUrls: ['./importEditDialog.component.css']
})
export class ImportEditDialogComponent implements OnInit {
  @ViewChild('send',{static:true})sendData!:any;
  importInfoAction:string="";
  // @ViewChild('send',{static:true})getRowData!:any;
  formImport = this.fb.group({
    id:[],
    address:['',[Validators.required,Validators.minLength(10),Validators.maxLength(50)]],
    date:['',[Validators.required]],
    shipperName:['',[Validators.required,Validators.minLength(2),Validators.maxLength(50)]],
    staffName:['',[Validators.required,Validators.minLength(2),Validators.maxLength(50)]],
  })

  statusList:number[]=[1,2,3,4]
  formImportProduct = this.fb.group({
    importInfoId:['',[Validators.required]],
    name:['',[Validators.required,Validators.minLength(2),Validators.maxLength(250)]],
    quantityImport:['',[Validators.required,Validators.pattern("^[0-9]*$"),Validators.min(1),Validators.max(1000000)]],
    priceImport:['',[Validators.required,Validators.min(0),Validators.max(1000000000)]],
    status:['',[Validators.required]]
  })
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {id: string},
    private rest:RestApiService,private fb:FormBuilder,
    private message:AlertService,private sharedData:SharedDataService) { }
  obs$!:Subscription;
  hideContent = true;
  ngOnInit() {
    console.log(this.data.id);
    this.obs$ = this.getData().subscribe();
  }

  getData(){
    return this.rest.get(GlobalUrl.get_AllImport_Admin).pipe(
      mergeMap((data:any) =>data),
      // tap((e:any)=>console.log(e)),
      tap((e:any)=>{
        if(e.id  === this.data.id){
          this.formImport.patchValue(e);
        }
      }),
      pluck('importInfo'),
      mergeMap((data:any) =>data),
      filter((e:any)=>e.importID === this.data.id),
      toArray(),
      tap((e)=>this.sendData = e),
      shareReplay(),
    )
  }
  getRowData(event:any){
    this.formImportProduct.patchValue(event);
    this.hideContent = false;
    if(event==='delete'){
      this.resetForm();
    }
  }
  reSendData(event:any){
    if(event==='requestNewData'){
      console.log("requestNewData");
      this.obs$ = this.getData().subscribe(((data)=>{
        this.sharedData._sharedMessage({msg:"requestRefresh",data:data})
      }));
    }
  }
  submitImport(){
    console.log("run");
    console.log(this.formImport.value);
    if(this.formImport.valid){
      let converter = {
        id:this.id?.value,
        date:this.date?.value,
        address:this.address?.value,
        shipperName:this.shipperName?.value,
        staffName:this.staffName?.value,
        picture:"",
        isDeleted:false,
      }
      this.obs$ = this.rest.put(GlobalUrl.put_UpdateImport_Admin,converter,this.id?.value).pipe(
        map((data:any)=>{
          if(data.message === 'OK'){
            this.message.successMessage("Cập nhật thông tin nhập hàng thành công!");
            this.resetImport();
            this.sharedData._sharedMessage("refresh");
          }else{
            this.message.errorMessage("Cập nhật thông tin nhập hàng thất bại!");
          }
        })
      ).subscribe()
      
    }else{
      validateAllFormFields(this.formImport);
    }
    
  }
  resetImport(){
    this.formImport.reset();
    this.ngOnInit();
  }
  submit(){

    console.log(JSON.stringify(this.formImportProduct.value));
    
    if(this.formImportProduct.valid){
      let converter = {
        id:this.importInfoId?.value,
        name:this.name?.value,
        quantityImport:this.quantityImport?.value,
        priceImport:this.priceImport?.value,
        status:this.status?.value,
      }
      console.log(converter);
      this.obs$ = this.rest.put(GlobalUrl.put_UpdateImportInfo_Admin,converter,this.importInfoId?.value).pipe(
        map((data:any) =>{
          if(data.message === 'OK'){
            this.message.successMessage("Cập nhật thông tin nhập hàng thành công!");
            this.ngOnInit();
            this.resetForm();
            this.obs$ = this.getData().subscribe((e)=>{
              // this.refreshTable.next(e);
              this.sharedData._sharedMessage({msg:"refresh",data:e});
            });
          }else{
            this.message.errorMessage("Cập nhật thông tin nhập hàng thất bại!");
          }
        })
      ).subscribe();
    }else{
      validateAllFormFields(this.formImportProduct);
    }
    
  }
  resetForm() {
    this.formImportProduct.reset();
    this.hideContent = true;
  }
  ngOnDestroy() {
    if(this.obs$){
      this.obs$.unsubscribe();
    }
  }

  get id(){return this.formImport.get('id')};
  get address(){return this.formImport.get('address')};
  get date(){return this.formImport.get('date')};
  get shipperName(){return this.formImport.get('shipperName')};
  get staffName(){return this.formImport.get('staffName')};

  get importInfoId(){return this.formImportProduct.get('importInfoId')};
  get name(){return this.formImportProduct.get('name')};
  get quantityImport(){return this.formImportProduct.get('quantityImport')};
  get priceImport(){return this.formImportProduct.get('priceImport')};
  get status(){return this.formImportProduct.get('status')};
}
