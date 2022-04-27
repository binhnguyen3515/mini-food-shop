import { UtilityService } from 'src/app/services/utility.service';
import { map, mergeMap, shareReplay, Subject, Subscription, tap, toArray } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RestApiService } from 'src/app/services/rest-api.service';
import { GlobalUrl } from 'src/app/common/url';
import { TokenStorageService } from 'src/app/guards/tokenStorage.service';
import { SharedDataService } from 'src/app/services/sharedData.service';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-adminProduct',
  templateUrl: './adminProduct.component.html',
  styleUrls: ['./adminProduct.component.css']
})
export class AdminProductComponent implements OnInit {
  @ViewChild('data',{static:true})sendData!:any;
  @ViewChild('entity',{static:true})setEntity!:string;
  refreshTable:Subject<any>=new Subject();
  
  constructor(private rest:RestApiService,private utility: UtilityService,private sharedData:SharedDataService) { 
    
  }
  obs$!:Subscription;
  ngOnInit() {
    this.setEntity = "Product";
    this.obs$ = this.getData().subscribe(data => {
      // this.sendData = data;
      this.sendData = {entity:'Product',data:data};
    })

    this.obs$ = this.sharedData.currentMessage.subscribe(msg=>{
      if(msg === 'refresh'){
        this.getData().subscribe((data:any) =>{
          this.refreshTable.next(data);
        })
      }
    })
  }

  getData(){
    return this.rest.get(GlobalUrl.get_AllProduct_Admin).pipe(
      tap((e)=>console.log(e)),
      mergeMap((data:any)=>data),
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
      // tap((e)=>console.log(e)),
      shareReplay(),
    )
  }
  ngOnDestroy() {
    if(this.obs$){
      this.obs$.unsubscribe();
    }
  }
}
