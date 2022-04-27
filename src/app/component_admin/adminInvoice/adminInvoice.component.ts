import { Component, OnInit, ViewChild } from '@angular/core';
import { defer, map, mergeMap, shareReplay, Subject, Subscription, tap, toArray, filter } from 'rxjs';
import { GlobalUrl } from 'src/app/common/url';
import { AuthService } from 'src/app/guards/auth.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SharedDataService } from 'src/app/services/sharedData.service';

@Component({
  selector: 'app-adminInvoice',
  templateUrl: './adminInvoice.component.html',
  styleUrls: ['./adminInvoice.component.css']
})
export class AdminInvoiceComponent implements OnInit {
  @ViewChild('data',{static:true})sendData!:any;
  @ViewChild('entity',{static:true})setEntity!:string;
  refreshTable:Subject<any>=new Subject();

  constructor(private rest:RestApiService,private sharedData:SharedDataService,
    private auth:AuthService) { }
  obs$!:Subscription;

  ngOnInit() {
    this.setEntity = "Invoice";
    this.obs$ = this.getData().subscribe((data:any) => {
      this.sendData = {entity:'Invoice',data:data};
    });
    this.obs$ = this.sharedData.currentMessage.subscribe(msg=>{
      if(msg === 'refresh'){
        this.getData().subscribe((data:any) =>{
          this.refreshTable.next(data);
        })
      }
    })
  }

  getData() {
    return  this.rest.get(GlobalUrl.get_AllInvoice_Admin).pipe(
      tap((e)=>console.log(e)),
      mergeMap((data:any) =>data),
      map((data:any) =>{
        return {
          id:data.id,
          user_ID:data.userId,
          phone:data.phone,
          address:data.address,
          date:data.date,
          status:data.status,
          total_Pay:data.totalPayment,
          total_Pay_Net:data.totalPaymentNet,
        }
      }),
      filter((e)=>!this.auth.isAdminOrManager()?e.status=='Shipping':true),
      filter((e)=>e.status!=='Delete'),
      toArray(),
      shareReplay(),
    )
  }

  ngOnDestroy() {
    if(this.obs$){
      this.obs$.unsubscribe();
    }
  }
}
