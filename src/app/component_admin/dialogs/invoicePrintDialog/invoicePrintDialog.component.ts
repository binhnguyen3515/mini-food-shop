import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter, map, mergeMap, Observable, pluck, shareReplay, switchMap, tap } from 'rxjs';
import { GlobalUrl } from 'src/app/common/url';
import { TokenStorageService } from 'src/app/guards/tokenStorage.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-invoicePrintDialog',
  templateUrl: './invoicePrintDialog.component.html',
  styleUrls: ['./invoicePrintDialog.component.scss'],
})
export class InvoicePrintDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private rest: RestApiService,public tokenStorage: TokenStorageService
  ) {}

  invoice_list$!:Observable<any>;
  totalMoney$!:Observable<any>;
  userInfo$!:Observable<any>;
  invoice_info$!:Observable<any>;
  ngOnInit() {
    console.log(this.data.id);
    this.invoice_list$ = this.getSendDataValue();
    this.totalMoney$ = this.getTotalMoney();
    this.userInfo$ = this.getUserInfo();
    this.invoice_info$ = this.getInvoiceInfo();
  }

  getSendDataValue(){
    return this.rest.get(GlobalUrl.get_AllInvoice_Admin).pipe(
      tap((e)=>console.log(e)),
      mergeMap((data:any) =>data),
      filter((data:any)=>data.id == this.data.id),
      pluck('detailedInvoice'),
      shareReplay(),
    )
  }

  getUserInfo(){
    return this.rest.get(GlobalUrl.get_AllInvoice_Admin).pipe(
      mergeMap((data:any) =>data),
      filter((data:any)=>data.id == this.data.id),
      pluck('userId'),
      switchMap((data_:any) =>{
        return this.rest.get(GlobalUrl.get_AllAccount_Admin).pipe(
          mergeMap((data:any) =>data),
          filter((data:any)=>data.id === data_),
        )
      }),
      shareReplay(),
    )
  }

  getTotalMoney(){
    return this.rest.getOne(GlobalUrl.get_Invoice_TotalMoney_Admin,this.data.id).pipe(
      pluck('totalMoneyById'),
      mergeMap((data:any)=>data),
      tap((e)=>console.log(e)),
      map((data:any)=>{
        return{
          totalMoney:data[0],
          totalMoneyNet:data[1],
        }
      }),
    )
  }

  getInvoiceInfo(){
    return this.rest.get(GlobalUrl.get_AllInvoice_Admin).pipe(
      tap((e)=>console.log(e)),
      mergeMap((data:any) =>data),
      filter((data:any)=>data.id == this.data.id),
      shareReplay(),
    )
  }

  onPrint() {
    window.print();
  }
}
