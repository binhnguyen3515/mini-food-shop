import { formatNumber } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { map, mergeMap, shareReplay, Subject, Subscription, tap, toArray } from 'rxjs';
import { GlobalUrl } from 'src/app/common/url';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SharedDataService } from 'src/app/services/sharedData.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-adminRecoverProduct',
  templateUrl: './adminRecoverProduct.component.html',
  styleUrls: ['./adminRecoverProduct.component.scss']
})
export class AdminRecoverProductComponent implements OnInit {
  @ViewChild('data',{static:true})sendData!:any;
  @ViewChild('entity',{static:true})setEntity!:string;
  refreshTable:Subject<any>=new Subject();
  constructor(private rest:RestApiService,private sharedData:SharedDataService,private utility: UtilityService) { }
  obs$!:Subscription;

  ngOnInit() {
    this.setEntity = "Recover Product";

    this.obs$ = this.getData().subscribe((data:any) =>{
      this.sendData = {entity:'Recover Product',data:data};
    })

    this.obs$ = this.sharedData.currentMessage.subscribe(msg=>{
      if(msg ==='refresh'){
        this.getData().subscribe((data:any)=>{
          this.refreshTable.next(data);
        })
      }
    })
  }

  getData(){
    return this.rest.get(GlobalUrl.get_deleted_Product).pipe(
      tap((e)=>console.log(e)),
      mergeMap((data:any) =>data),
      map((data:any)=>{
        return {
          id:data.id,
          picture:data.picture,
          category:data.categorySub.category.name,
          name:data.name,
          expiration:this.utility.calculateExpiredDateCompact(data.productDetailsDTO.dateEnd),
          discount:data.discountDTO?formatNumber(data.discountDTO.percentage*100,'en','1.0-2')+"%":"0%",
          quantity:data.productDetailsDTO.quantity>0?data.productDetailsDTO.quantity:"0",
          price:data.productDetailsDTO.priceSell,
          rate:data.starAveraged?data.starAveraged:"No rate",
          available:data.productDetailsDTO.available?'Yes':'No',
          imported:data.importInfo==null?'No':'Yes',
        }
      }),
      toArray(),
      shareReplay(),
    )
  }

  getRole(data:any){
    return data.map((e:any)=>e.role.name.toUpperCase()).join(', ')
  }
  
  ngOnDestroy() {
    if(this.obs$){
      this.obs$.unsubscribe();
    }
  }
}
