import { Router } from '@angular/router';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/guards/auth.service';
import { map, mergeMap, Observable, shareReplay, Subscription, tap, toArray } from 'rxjs';
import { RestApiService } from 'src/app/services/rest-api.service';
import { GlobalUrl } from 'src/app/common/url';
import { TokenStorageService } from 'src/app/guards/tokenStorage.service';
import { CartDTO } from 'src/app/models-dto/cartDTO';

@Component({
  selector: 'app-payment_log',
  templateUrl: './payment_log.component.html',
  styleUrls: ['./payment_log.component.css']
})
export class Payment_logComponent implements OnInit,OnDestroy {
  // @Input() invoice$!:Invoice[];
  @Input() invoice$!:Observable<any>;
  _totalItems_Invoice:number = 0;
  page_Invoice:number = 1;
  constructor(private auth:AuthService,
    private route:Router,
    private rest:RestApiService,public tokenStorage:TokenStorageService) { }
  
  getPaymentLog$!:Subscription;
  ngOnInit() {
    // this.invoice$ = Array.from(Array(100),()=> Math.floor(10 * Math.random()));
    // this._totalItems_Invoice = this.invoice$.length;
    this.invoice$ = this.rest.getOne(GlobalUrl.get_payment_log,this.tokenStorage.getUser().id)
    .pipe(mergeMap(async (data) => data as CartDTO),
      map((data: CartDTO)=>data),
      map((data:any)=>data.sort((a:any,b:any)=>a.date>b.date?-1:1)),
      tap((a)=>console.log(a)),
      shareReplay())
  }
  showInvoiceDetail(e:any){
    var target = e.currentTarget;
    var chooseTarget = target.parentElement?.parentElement?.parentElement?.querySelectorAll('.order_details_title');
    
    chooseTarget.forEach((e:any)=>{
      e.classList.toggle('hidden');
    })
    
  }
  logout(){
    this.auth.logout();
    this.route.navigate(['home/login']);
    // this.sharedData.changeData("Bạn");
  }

  ngOnDestroy() {
    
  }
}
