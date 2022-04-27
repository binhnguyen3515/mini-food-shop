import { Component, OnInit, ViewChild } from '@angular/core';
import { map, mergeMap, pluck, shareReplay, Subject, Subscription, switchMap, toArray, tap } from 'rxjs';
import { GlobalUrl } from 'src/app/common/url';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-adminTopCustomer',
  templateUrl: './adminTopCustomer.component.html',
  styleUrls: ['./adminTopCustomer.component.scss']
})
export class AdminTopCustomerComponent implements OnInit {
  @ViewChild('data',{static:true})sendData!:any;
  @ViewChild('entity',{static:true})setEntity!:string;
  refreshTable:Subject<any>=new Subject();
  obs$!:Subscription;
  constructor(private rest:RestApiService) { }

  ngOnInit() {
    this.setEntity = 'Top Customer';
    this.obs$ = this.getData().subscribe(data=>{
      this.sendData = {entity:'Top Customer',data:data};
    })
  }


  getData() {
    let i = 1;
    return this.rest.get(GlobalUrl.get_Top_Customer).pipe(
      pluck('topCustomer'),
      mergeMap((data:any) =>data),
      map((data:any) =>{
        return{
          top:i++,
          avatar:data[0]===null||data[0]?.length==0?"empty_user.png":data[0],
          name:data[1],
          email:data[2],
          phone:data[3],
          gender:data[4]?"Nam":"Nữ",
          totalPayment:data[5],
        }
      }),
      toArray(),
      tap((e)=>console.log(e)),
      shareReplay(),
    );
  }

  ngOnDestroy() {
    if(this.obs$){
      this.obs$.unsubscribe();
    }
  }
}
