import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { GlobalUrl } from 'src/app/common/url';
import { ProductDetailsDtoById } from 'src/app/models-dto/productDetailsDTObyID';
import { AlertService } from 'src/app/services/alert.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-sharedProductDisplay',
  templateUrl: './sharedProductDisplay.component.html',
  styleUrls: ['./sharedProductDisplay.component.css']
})
export class SharedProductDisplayComponent implements OnInit {
  @Input() productData$!:ProductDetailsDtoById[];
  filterData$!:ProductDetailsDtoById[];
  page_product:number = 1;
  baseHostImageUrl = GlobalUrl.baseHostImageUrl;
  constructor(private cartService:CartService,private message:AlertService) {}
  ngOnInit() {
    // try {
    //   this.productData$=this.productData$.filter((e)=>e.productDetailsDTO.available==true&&e.productDetailsDTO.priceSell!==0&&e.productDetailsDTO.quantity!==0)
    // } catch (error) {
      
    // }
  }
  
  addToCart(item:ProductDetailsDtoById){
    // if(item?.productDetailsDTO?.quantity<=10){
    //   this.message.warningMessage("Sản phẩm hiện đang hết hàng, quý khách thông cảm!")
    //   return;
    // }
    this.cartService.addItem(item);
  }
}
