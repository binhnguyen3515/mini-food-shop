import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, pluck, scan, shareReplay, tap, Subscription } from 'rxjs';
import { GlobalUrl } from 'src/app/common/url';
import { ProductDetailsDtoById } from 'src/app/models-dto/productDetailsDTObyID';
import { CartService } from 'src/app/services/cart.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-categorySub',
  templateUrl: './categorySub.component.html',
  styleUrls: ['./categorySub.component.css']
})
export class CategorySubComponent implements OnInit,OnDestroy {
  @ViewChild('productByCategory',{static:true}) listProductBySubCategory$!:ProductDetailsDtoById[];

  _totalItems_Product:number = 0;
  page_Product:number = 1;
  constructor(private route:ActivatedRoute,private rest:RestApiService,
    private cartService:CartService,
    private cd:ChangeDetectorRef) { }
  obs$!:Subscription;
  categorySubName$!:Observable<string>;
  ngOnInit() {
    this.obs$ = this.route.params.pipe(
      pluck('cateSubID'),
      tap((id)=>this.getProductByCategorySub(id)),
      shareReplay()).subscribe();
  }

  getProductByCategorySub(id:string){
    this.obs$ = this.rest.get(GlobalUrl.get_AllProduct_By_CategorySub+id)
    .pipe(scan((a: any,b: any)=>[...a,b]),
    //tap((data)=>console.log(data)),
    shareReplay()
    ).subscribe(data=>{
      this.listProductBySubCategory$ = data as ProductDetailsDtoById[];
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
