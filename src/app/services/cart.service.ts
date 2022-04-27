import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductDetailsDtoById } from '../models-dto/productDetailsDTObyID';
import { AlertService } from './alert.service';
import Swal from 'sweetalert2';
import { AuthService } from '../guards/auth.service';
import { TokenStorageService } from '../guards/tokenStorage.service';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: ProductDetailsDtoById[] = [];
  numberOfItems = new BehaviorSubject<ProductDetailsDtoById[]>([]);
  constructor(private alertService: AlertService,private auth:AuthService,private token:TokenStorageService) {this.loadFromLocalStorage()}

  addItem(item: ProductDetailsDtoById) {
    const exist = this.cartItems.find((cart) => cart.productDetailsDTO.id === item.productDetailsDTO.id);
    if (exist) {
      exist.productDetailsDTO.quantity++;
    } else {
      item.productDetailsDTO.quantity = 1;
      this.cartItems.push(item);
    }
    this.alertService.successMessage("Thêm sản phẩm thành công");
    this.saveToLocalStorage();
  }
  updateCart(quantity: number, item: ProductDetailsDtoById) {
    item.productDetailsDTO.quantity = quantity;
    const index = this.cartItems.findIndex((cart) => cart.productDetailsDTO.id === item.productDetailsDTO.id);
    this.cartItems[index] = item;
    console.log({ item: item });
    this.saveToLocalStorage();
  }

  remove(id: number) {
    Swal.fire({
      title: `Xoá sản phẩm`,
      text: `Bạn có muốn xoá sản phẩm này?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        const index = this.cartItems.findIndex((cart) => cart.productDetailsDTO.id === id);
        this.cartItems.splice(index, 1);
        this.saveToLocalStorage();
        Swal.fire(
          'Đã xoá sản phẩm khỏi giỏ hàng!',
          '',
          'success'
        )
      }
    })
  }
  removeItemPopUp(id:number){
    const index = this.cartItems.findIndex((cart) => cart.productDetailsDTO.id === id);
    this.cartItems.splice(index, 1);
    this.saveToLocalStorage();
  }
  clear() {
    
    Swal.fire({
      title: `Xoá giỏ hàng`,
      text: `Bạn có muốn xoá giỏ hàng?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartItems = [];
        this.saveToLocalStorage();
        this.saveToLocalStorage();
        Swal.fire(
          'Đã xoá thành công giỏ hàng!',
          '',
          'success'
        )
      }
    })
  }
  resetAfterPayment(){
    this.cartItems = [];
    this.saveToLocalStorage();
    this.saveToLocalStorage();
  }
  saveToLocalStorage() {
    this.numberOfItems.next(this.cartItems);
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }
  loadFromLocalStorage() {
    const json = localStorage.getItem('cart');
    this.cartItems = json ? JSON.parse(json) : [];
    this.numberOfItems.next(this.cartItems);
  }
  get CartItems():ProductDetailsDtoById[]{
    const json = localStorage.getItem('cart');
    return json ? JSON.parse(json) : [];
  }

  get isEmptyCart():Boolean{
    return !(this.cartItems == [] || this.cartItems.length == 0);
  }

  get totalMoney():number{
    return this.cartItems.
    map(item=>item.discountDTO?(item.productDetailsDTO.priceSell*(1-item.discountDTO.percentage)*item.productDetailsDTO.quantity):
    item.productDetailsDTO.priceSell*item.productDetailsDTO.quantity).reduce((sum,qty)=>sum+=qty,0);
  }

  get totalMoneyNet():number{
    let memberShipType = "Silver";
    if(this.auth.isLoggedIn()){
      memberShipType = this.token.getUser()?.memberShip?.type;
      if(memberShipType == "Silver"){
        return this.totalMoney;
      }
      if(memberShipType == "Gold"){
        return this.totalMoney * (1 - 0.02);
      }
      if(memberShipType == "Platinum"){
        return this.totalMoney * (1 - 0.05);
      }
    }
    return this.totalMoney;
  }
}
