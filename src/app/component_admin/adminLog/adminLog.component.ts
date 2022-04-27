import { Component, OnInit, ViewChild } from '@angular/core';
import { map, mergeMap, pluck, shareReplay, Subject, Subscription, tap, toArray } from 'rxjs';
import { GlobalUrl } from 'src/app/common/url';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SharedDataService } from 'src/app/services/sharedData.service';

@Component({
  selector: 'app-adminLog',
  templateUrl: './adminLog.component.html',
  styleUrls: ['./adminLog.component.scss']
})
export class AdminLogComponent implements OnInit {
  @ViewChild('data',{static:true})sendData!:any;
  @ViewChild('entity',{static:true})setEntity!:string;
  refreshTable:Subject<any>=new Subject();
  
  constructor(private rest:RestApiService,private sharedData:SharedDataService) { }
  obs$!:Subscription;
  
  ngOnInit() {
    this.setEntity = "Account Log";
    this.obs$ = this.getDataAccountLog().subscribe((data:any) =>{
      this.sendData = {entity:'Account Log',data:data};
    })

    this.obs$ = this.sharedData.currentMessage.subscribe(msg=>{
      if(msg ==='refresh'){
        this.getDataAccountLog().subscribe((data:any)=>{
          this.refreshTable.next(data);
        })
      }
    })
  }

  getDataAccountLog(){
    let i = 1;
    return this.rest.get(GlobalUrl.get_log_Admin).pipe(
      pluck('accountLog'),
      mergeMap((data:any) =>data),
      map((data:any) =>{
        return {
          id:i++,
          avatar:data[1]===null||data[1].length==0?"empty_user.png":data[1],
          userId:data[6],
          name:data[0],
          date:data[3],
          description:data[4],
          role:data[7],
        }
      }),
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
