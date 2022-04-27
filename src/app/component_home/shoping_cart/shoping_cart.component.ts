import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalUrl } from 'src/app/common/url';
import { validateAllFormFields, ValidatePhone } from 'src/app/common/validators';
import { AuthService } from 'src/app/guards/auth.service';
import { TokenStorageService } from 'src/app/guards/tokenStorage.service';
import { ProductDetailsDtoById } from 'src/app/models-dto/productDetailsDTObyID';
import { AlertService } from 'src/app/services/alert.service';
import { CartService } from 'src/app/services/cart.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-shoping_cart',
  templateUrl: './shoping_cart.component.html',
  styleUrls: ['./shoping_cart.component.css']
})
export class Shoping_cartComponent implements OnInit,OnDestroy {
  baseHostImageUrl = GlobalUrl.baseHostImageUrl;
  obs$!:Subscription;
  cartItems:ProductDetailsDtoById[] = [];
  isLoginStatus = false;
  orderDTO:any;
  orderForm = this.fb.group({
    phone:['',[Validators.required, ValidatePhone]],
    address:['',[Validators.required]],
    customerNotes:[''],
  })
  constructor(public cartService: CartService,private auth:AuthService,
    private message:AlertService,private router:Router,
    private fb:FormBuilder,public tokenStorage:TokenStorageService,
    private rest:RestApiService) { }
  

  ngOnInit() {
    window.scrollTo(0, 0);
    this.cartService.numberOfItems.subscribe(data=>{
      this.cartItems = data;
    })

  }
  quantityChange(event:any,item:ProductDetailsDtoById){
    this.cartService.updateCart(+event.value, item);
  }

  decrement(qty:number,item:ProductDetailsDtoById){
    this.cartService.updateCart(qty, item);
  }
  
  increment(qty:number,item:ProductDetailsDtoById){
    this.cartService.updateCart(qty, item);
  }
  //test data
  // account = {phone:"0913806577",address:"189 Cù Thiên Xích, Phố đèn đỏ, Quận Cam",customerNotes:"Giao hàng nhớ bấm chuông!"};
  //test data edge
  checkOut(){
    if(!this.auth.isLoggedIn()){
      this.message.warningMessage("Bạn vui lòng đăng nhập để thực hiện thanh toán!");
      this.router.navigate(['home/login']);
    }else{
      this.isLoginStatus = true;
      this.orderForm.patchValue(this.tokenStorage.getUser());
    }
  }

  getDetailedInvoice(){
    return this.cartService.CartItems.map((item:ProductDetailsDtoById)=>{
      return{ 
        detailedProductId:item.productDetailsDTO.id,
        price:item.productDetailsDTO.priceSell,
        quantity:item.productDetailsDTO.quantity,
        discount:item.discountDTO?item.discountDTO.percentage:0,
      }
    })
  }
  order(){
    if(this.orderForm.valid){
      console.log(this.orderForm.value);
      this.orderDTO = {
        date:new Date(),
        customerNotes:this.customerNotes?.value,
        phone:this.phone?.value,
        address:this.address?.value,
        status:"Pending",
        userId:this.tokenStorage.getUser().id,
        detailedInvoice:this.getDetailedInvoice(),
        totalPayment:this.cartService.totalMoney,
        totalPaymentNet:this.cartService.totalMoneyNet,
      }
      console.log(this.orderDTO);
      this.obs$ = this.rest.post(GlobalUrl.post_create_invoice,this.orderDTO)
        .subscribe(()=>{
          this.cartService.resetAfterPayment();
          // console.log(JSON.stringify(this.orderDTO));
          console.log(this.orderDTO);
      
          this.message.successMessage("Cảm ơn bạn đã mua hàng!");
          window.scrollTo(0, 0);
        },(err)=>{
          this.message.errorMessage(err.message);
        })
     
    }else{
      validateAllFormFields(this.orderForm);
    }
  }
  get phone() {return this.orderForm.get('phone')};
  get address() {return this.orderForm.get('address')};
  get customerNotes() {return this.orderForm.get('customerNotes')};

  ngOnDestroy(): void {
    if(this.obs$){
      this.obs$.unsubscribe();
    }
  }
}
