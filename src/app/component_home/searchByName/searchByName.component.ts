import { ProductDetailsDtoById } from 'src/app/models-dto/productDetailsDTObyID';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, pluck, Subscription, tap, shareReplay, mergeMap, toArray, scan, catchError, of } from 'rxjs';
import { Product } from 'src/app/models/Product';
import { RestApiService } from 'src/app/services/rest-api.service';
import { GlobalUrl } from 'src/app/common/url';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-searchByName',
  templateUrl: './searchByName.component.html',
  styleUrls: ['./searchByName.component.css']
})
export class SearchByNameComponent implements OnInit,OnDestroy {
  @ViewChild('searchProduct',{static:true}) listProductAfterSearch$!:ProductDetailsDtoById[];

  constructor(private route:ActivatedRoute,private rest:RestApiService,
    private cartService:CartService) { }
  obs$!:Subscription;
  nameSearch$!:Observable<string>;

  ngOnInit() {
    this.obs$ = this.route.params.pipe(
      pluck('searchName'),
      tap((name)=>this.getProductByName(name)),
      shareReplay()).subscribe((data)=>{
        this.nameSearch$ = data;
      })
  }
  getProductByName(name:string){
    this.obs$ = this.rest.get(GlobalUrl.get_AllProduct_By_Name+"?name="+name.toLowerCase())
      .pipe(scan((a: any,b: any)=>[...a,b]),shareReplay(),)
      .subscribe((data)=>{
        this.listProductAfterSearch$ = (data as ProductDetailsDtoById[]).filter((e)=>e.productDetailsDTO.available==true&&e.productDetailsDTO.priceSell!==0&&e.productDetailsDTO.quantity!==0);
      })
  }

  addToCart(item:ProductDetailsDtoById){
    this.cartService.addItem(item);
  }
  ngOnDestroy(){
    if(this.obs$){
      this.obs$.unsubscribe();
    }
  }
}
