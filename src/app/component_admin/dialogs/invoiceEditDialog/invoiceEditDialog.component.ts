import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter, map, mergeMap, pluck, shareReplay, Subject, Subscription, tap } from 'rxjs';
import { GlobalUrl } from 'src/app/common/url';
import { validateAllFormFields } from 'src/app/common/validators';
import { AlertService } from 'src/app/services/alert.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SharedDataService } from 'src/app/services/sharedData.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoiceEditDialog',
  templateUrl: './invoiceEditDialog.component.html',
  styleUrls: ['./invoiceEditDialog.component.css']
})
export class InvoiceEditDialogComponent implements OnInit,OnDestroy {
  @ViewChild('send',{static:true})sendData!:any;
  @ViewChild('send',{static:true})sendUserID!:any;
  @ViewChild('send',{static:true})sendInvoiceID!:any;
  refreshTable:Subject<any>=new Subject();
  // @ViewChild(AdminInvoiceInnerTableComponent,{static:true})component!:AdminInvoiceInnerTableComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {id: string},
    private rest:RestApiService,private fb:FormBuilder,
    private message:AlertService,private sharedData:SharedDataService) { }

  formEditInvoiceItem = this.fb.group({
    id:[''],
    name:[''],
    price:['',[Validators.required,Validators.min(0),Validators.max(1000000000)]],
    quantity:['',[Validators.required,Validators.pattern("^[0-9]*$"),Validators.min(1),Validators.max(10)]],
    discount:['',[Validators.required,Validators.min(0),Validators.max(1000000000)]],
  })
  obs$!:Subscription;
  hideContent = true;
  memberShip:any;
  totalPayment:any;
  ngOnInit() {
    console.log("invoiceID:"+this.data.id);
    this.sendInvoiceID=this.data.id;
    this.obs$ = this.getSendDataValue().subscribe();
    this.obs$ = this.getTotalMoney().subscribe();
  }

  getSendDataValue(){
    return this.rest.get(GlobalUrl.get_AllInvoice_Admin).pipe(
      mergeMap((data:any) =>data),
      filter((data:any)=>data.id == this.data.id),
      tap((e)=>this.sendUserID = e.userId),
      pluck('detailedInvoice'),
      tap((e)=>this.sendData = e),
      tap((e)=>console.log(e)),
      shareReplay(),
    )
  }

  getTotalMoney(){
    return this.rest.getOne(GlobalUrl.get_Invoice_TotalMoney_Admin,this.data.id).pipe(
      pluck('totalMoneyById'),
      mergeMap((data:any)=>data),
      map((data:any)=>{
        return{
          totalMoney:data[0],
          totalMoneyNet:data[1],
        }
      }),
      tap((e)=>this.totalPayment = e),
    )
  }

  getRowData(event:any){
    if(event === 'delete' || event ==='add'){
      this.hideContent = true;
      this.formEditInvoiceItem.reset();
      this.getSendDataValue().subscribe((data)=>{
        this.refreshTable.next(data);
        this.obs$ = this.getTotalMoney().subscribe();
      });
    }else{
      this.hideContent = false;
      this.formEditInvoiceItem.patchValue(event);
      this.discount?.setValue(event.discount*100);
    }
  }
  getMemberShipType(event:any){
    console.log(event);
    
    this.memberShip = event;
  }
  resetInvoice(){
    this.formEditInvoiceItem.reset();
    this.hideContent=true
  }
  submitInvoice(){
    console.log(this.formEditInvoiceItem.value);
    
    
    if(this.formEditInvoiceItem.valid){
      console.log("valid");
      Swal.fire({
        title: `Cập nhật hoá đơn`,
        text: `Bạn có muốn cập nhật thông tin hoá đơn này`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Update'
      }).then((result) => {
        if (result.isConfirmed) {
          let item = {id:this.id?.value,price:this.price?.value,quantity:this.quantity?.value,memberShip:this.memberShip}
          this.obs$ = this.rest.put(GlobalUrl.put_UpdateInvoiceItem,item,this.data.id).pipe(
          )
          .subscribe(()=>{
            Swal.fire(
              'Đã cập nhật!',
              'Cập nhật thành công.',
              'success'
            );
            this.ngOnInit();
            this.getSendDataValue().subscribe((data)=>{
              this.refreshTable.next(data);
            });
            this.sharedData._sharedMessage("refresh");
            this.obs$ = this.getTotalMoney().subscribe();
            this.resetInvoice();
          })
        }
      })   
    }else{
      validateAllFormFields(this.formEditInvoiceItem);
    }
  }

  ngOnDestroy() {
    if(this.obs$){
      this.obs$.unsubscribe();
    }
  }
  get id(){return this.formEditInvoiceItem.get('id')};
  get name(){return this.formEditInvoiceItem.get('name')};
  get price(){return this.formEditInvoiceItem.get('price')};
  get quantity(){return this.formEditInvoiceItem.get('quantity')};
  get discount(){return this.formEditInvoiceItem.get('discount')};
}
