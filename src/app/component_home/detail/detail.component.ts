import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap, Observable, of, pluck, shareReplay, Subject, Subscription, take, tap, toArray } from 'rxjs';
import { ProductDetailsDtoById } from 'src/app/models-dto/productDetailsDTObyID';
import { RestApiService } from 'src/app/services/rest-api.service';
import { ratingDTO } from 'src/app/models-dto/ratingDTO';
import { CartService } from 'src/app/services/cart.service';
import { validateAllFormFields, ValidatePhone } from 'src/app/common/validators';
import { AuthService } from 'src/app/guards/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { GlobalUrl } from 'src/app/common/url';
import { ValidationService } from 'src/app/services/validation.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit,OnDestroy {
  baseHostImageUrl = GlobalUrl.baseHostImageUrl;
  popularProduct$!:Observable<any>;
  detailProduct$!:Subscription;
  detailProductById$!:ProductDetailsDtoById;
  expiredDuration!:number;
  isLoginStatus = false;
  
  _5Star:number = 0;
  _4Star:number = 0;
  _3Star:number = 0;
  _2Star:number = 0;
  _1Star:number = 0;

  _5StarPercentage:number = 0;
  _4StarPercentage:number = 0;
  _3StarPercentage:number = 0;
  _2StarPercentage:number = 0;
  _1StarPercentage:number = 0;

  _totalRateCount:number = 0;
  _averageRate:number = 0;
  yourRate:number = 0;

  //rating pagination
  @Input() ratingByUsers$!: ratingDTO[];
  _totalItems_rating:number = 0;
  page_rating:number = 1;

  accessForm = this.fb.group({
    comment:[''],
    gender:[''],
    name:['',[Validators.required,Validators.minLength(2),Validators.maxLength(30)]],
    phone:['',Validators.compose([Validators.required,ValidatePhone]),this.validationService.isExistedPhone().bind(this)],
    email:['',Validators.compose([Validators.email]),this.validationService.isExistedEmail().bind(this)],
  })
  
  constructor(private fb:FormBuilder,private activatedRoute: ActivatedRoute,
    private rest:RestApiService,private cartService:CartService,
    private auth:AuthService,private message:AlertService,
    private validationService:ValidationService,public utility:UtilityService) { 

  }

  ngOnInit() {
    this.detailProduct$ = this.activatedRoute.params.pipe(
      pluck('id')).subscribe(id=>{
      this.rest.getOne(GlobalUrl.get_DetailedProduct,id).subscribe(data=>{
        this.detailProductById$ = data as ProductDetailsDtoById;
        try {
          this.ratingByUsers$ =  (data as ProductDetailsDtoById).ratingDTO
          .sort((a,b)=>(a.date > b.date ? -1 : 1));
        } catch (error) {
          
        }
        // console.log(this.detailProductById$);
        //star counting
        this._5Star =this.starCounting(data,5);
        this._4Star =this.starCounting(data,4);
        this._3Star =this.starCounting(data,3);
        this._2Star =this.starCounting(data,2);
        this._1Star =this.starCounting(data,1);

        this._totalRateCount = (this._5Star + this._4Star + this._3Star + this._2Star + this._1Star);
        //average score
        this._averageRate = ((this._5Star * 5) + (this._4Star * 4) + (this._3Star * 3) + (this._2Star * 2) + (this._1Star * 1))/this._totalRateCount;
        
        //star by percentage
        this._5StarPercentage =(this._5Star/this._totalRateCount)*100;
        this._4StarPercentage =(this._4Star/this._totalRateCount)*100;
        this._3StarPercentage =(this._3Star/this._totalRateCount)*100;
        this._2StarPercentage =(this._2Star/this._totalRateCount)*100;
        this._1StarPercentage =(this._1Star/this._totalRateCount)*100;
        
        //pagination
        this._totalItems_rating = this.ratingByUsers$?.length;
        
         //relevant Products//
        this.relevantProduct(this.detailProductById$.categorySub.id);
        //relevant Products edge//
      })
      
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
      take(10),
      toArray(),
    )

    //check Login to show rating input fields
    if(this.auth.isLoggedIn()){
      this.isLoginStatus = true;
    }else{
      this.isLoginStatus = false;
    }
    //check Login to show rating input fields edge

  }
  starCounting(data:any,star:number){
    let count = 0;
    try {
      return count = (data as ProductDetailsDtoById).ratingDTO
      .map(e=>e.star).filter(e=>e==star)
      .length;
    } catch (error) {
      
    }
    return count;
  }
  selectStar(star:number) {
    console.log(star);
    this.yourRate = star;
  }

  addToCart(item:ProductDetailsDtoById){
    // if(item?.productDetailsDTO?.quantity<=10){
    //   this.message.warningMessage("Sản phẩm hiện đang hết hàng, quý khách thông cảm!")
    //   return;
    // }
    this.cartService.addItem(item);
  }

  //rating handle
  submitAccess(){
    if(this.yourRate == 0){
      this.message.warningMessage("Vui lòng chọn số sao!");
    }else{
      let rating : any;
      if(this.auth.isLoggedIn()){
        rating = {
          date:new Date(),
          comment: this.comment?.value,
          star:this.yourRate,
          user:{id:1},
          productId:this.detailProductById$.id
        }
        console.log(rating);
        this.rest.post(GlobalUrl.post_rating_anonymous,rating)
        .pipe(tap(()=>{
          this.rest.RefreshRequest.next();
        })).subscribe(data=>{
          this.ngOnInit();
        })
        this.message.successMessage("Cảm ơn bạn đã gửi đánh giá");
        // this.resetAccessForm();
      }else{
        
        if(this.accessForm.valid){
          console.log(this.accessForm.value);
          rating = {
            date:new Date(),
            comment: this.comment?.value,
            star:this.yourRate,
            user:{
              name:this.name?.value,
              phone:this.phone?.value,
              email:this.email?.value,
              gender:this.gender?.value,
              password:"anonymous",
              isDeleted:true,
            },
            productId:this.detailProductById$.id
          }
          console.log(rating);
          this.rest.post(GlobalUrl.post_rating,rating)
          .pipe(tap(()=>{
            this.rest.RefreshRequest.next();
          })).subscribe(data=>{
            this.message.successMessage("Cảm ơn bạn đã gửi đánh giá");
            this.resetAccessForm();
            this.email?.reset();
          })
        }else{
          validateAllFormFields(this.accessForm);
        }
      }
      
    }
    
  }
  //rating handle edge
  get comment(){return this.accessForm.get('comment')};
  get gender(){return this.accessForm.get('gender')};
  get name(){return this.accessForm.get('name')};
  get phone(){return this.accessForm.get('phone')};
  get email(){return this.accessForm.get('email')};

  resetAccessForm(){
    //empty info
    this.yourRate = 0;
    this.ngOnInit();
    try {
      this.accessForm.reset();
    } catch (error) {
      
    }

  }

  ngOnDestroy(): void {
    if(this.detailProduct$){
      this.detailProduct$.unsubscribe();
    }
    if(this.obs$){

    }
  }

  /*sản phẩm liên quan */
  @ViewChild('relevantProduct',{static:true}) listRelevantProduct$!:ProductDetailsDtoById[];
  obs$!:Subscription;

  relevantProduct(id:number){
    this.obs$ = this.rest.get(GlobalUrl.get_AllProduct_By_CategorySub+id)
    .pipe(shareReplay()).subscribe(data=>{
      this.listRelevantProduct$ = data as ProductDetailsDtoById[];
    })
  }
}
