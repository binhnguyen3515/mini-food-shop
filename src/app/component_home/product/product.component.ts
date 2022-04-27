import { ProductDetailsDtoById } from './../../models-dto/productDetailsDTObyID';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ProductDTO_home } from 'src/app/models-dto/productDTO_home';
import { Discount } from 'src/app/models/Discount';
import { Product } from 'src/app/models/Product';
import { RestApiService } from 'src/app/services/rest-api.service';
import { GlobalUrl } from 'src/app/common/url';
import { CartService } from 'src/app/services/cart.service';
import { map, Observable, pluck, mergeMap, switchMap, toArray, take } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit,OnDestroy {
  @ViewChild('dataFruit',{static:true})fruitData$!:ProductDetailsDtoById[];
  @ViewChild('dataSellOff',{static:true})sellOffData$!:ProductDetailsDtoById[];
  @ViewChild('dataBeverage',{static:true})beverageData$!:ProductDetailsDtoById[];
  $productGetAll:any;
  popularProduct$!:Observable<any>;
  baseHostImageUrl = GlobalUrl.baseHostImageUrl;
  constructor(private rest:RestApiService,private cartService:CartService,private message:AlertService) {

  }
  
  ngOnInit() {
    this.$productGetAll = this.rest.get(GlobalUrl.get_AllProduct).subscribe(data=>{
      //Sản phẩm khuyến mãi
      this.sellOffData$ = (data as ProductDetailsDtoById[])
      .filter(data => data.discountDTO != null && data.discountDTO !== undefined)
      .sort((a,b)=>(a.discountDTO.percentage > b.discountDTO.percentage ? -1 : 1));

      //Rau củ trái cây
      this.fruitData$ = (data as ProductDetailsDtoById[])
      .filter(data => data.categorySub.category.name == 'RAU, CỦ, TRÁI CÂY')
      .sort((a,b)=>(a.productDetailsDTO.priceSell > b.productDetailsDTO.priceSell ? -1 : 1));

      //Đồ uống các loại
      this.beverageData$ = (data as ProductDetailsDtoById[])
      .filter(data => data.categorySub.category.name == 'ĐỒ UỐNG CÁC LOẠI')
      .sort((a,b)=>(a.productDetailsDTO.priceSell > b.productDetailsDTO.priceSell ? -1 : 1));

    })

    this.popularProduct$ = this.rest.get(GlobalUrl.get_Popular_Product).pipe(

      pluck('popularProduct'),
      mergeMap((data:any) =>data),
      map((data:any) =>{
        return{
          id:data[0],
          name:data[1],
          picture:data[2],
        }
      }),
      take(9),
      toArray(),
    )
  }
  addToCart(item:ProductDetailsDtoById){
    // if(item?.productDetailsDTO?.quantity<=10){
    //   this.message.warningMessage("Sản phẩm hiện đang hết hàng, quý khách thông cảm!")
    //   return;
    // }
    this.cartService.addItem(item);
  }

  ngOnDestroy(){
    this.$productGetAll.unsubscribe();
  }
}
