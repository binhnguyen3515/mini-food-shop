import { Component, OnInit, ViewChild } from '@angular/core';
import { filter, map, mergeMap, shareReplay, Subject, Subscription, tap, toArray } from 'rxjs';
import { GlobalUrl } from 'src/app/common/url';
import { AuthService } from 'src/app/guards/auth.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SharedDataService } from 'src/app/services/sharedData.service';

@Component({
  selector: 'app-adminAccount',
  templateUrl: './adminAccount.component.html',
  styleUrls: ['./adminAccount.component.css']
})
export class AdminAccountComponent implements OnInit {

  @ViewChild('data',{static:true})sendData!:any;
  @ViewChild('entity',{static:true})setEntity!:string;
  baseHostImageUrl = GlobalUrl.baseHostImageUrl;
  refreshTable:Subject<any>=new Subject();
  constructor(private rest:RestApiService,private sharedData:SharedDataService,public auth:AuthService) { }
  obs$!:Subscription;

  getRole(data:any){
    return data.map((e:any)=>e.role.name.toUpperCase()).join(', ')
  }

  ngOnInit() {
    this.setEntity = "Account";
    this.obs$ = this.getData().subscribe((data:any) => {
      this.sendData = {entity:'Account',data:data};
    })

    this.obs$ = this.sharedData.currentMessage.subscribe(msg => {
      if(msg === 'refresh'){
        this.getData().subscribe((data:any) => {
          this.refreshTable.next(data);
        })
      }
    })
  }

  getData() {
    return this.rest.get(GlobalUrl.get_AllAccount_Admin).pipe(
      tap((e)=>console.log(e)),
      mergeMap((data:any) =>data),
      map((data:any) =>{
        return {
          id:data.id,
          avatar:data.photo===null||data.photo.length==0?"empty_user.png":data.photo,
          name:data.name,
          memberShip:data.memberShip.type,
          phone:data.phone,
          email:data.email,
          gender:data.gender==null?"No Info":data.gender==false?"Nữ":"Nam",
          role:this.getRole(data.authorityDTO),
          address:data.address,
          // user_ID:data.userId,
          // address:data.address,
          // date:data.date,
          // status:data.status,
          // total_Pay:data.totalPayment,
          // total_Pay_Net:data.totalPaymentNet,
        }
      }),

      filter((e)=>!this.auth.isAdmin()?e.role.indexOf('ADMIN')==-1:true),
      toArray(),
      shareReplay(),
    )
  }
  ngOnDestroy() {
    if(this.obs$){
      this.obs$.unsubscribe();
    }
  }

  
}
