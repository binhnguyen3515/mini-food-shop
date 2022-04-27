import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ComponentFactory, ComponentFactoryResolver, OnInit, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, mergeMap, Observable, shareReplay, Subscription, tap, toArray, of, Subject } from 'rxjs';
import { GlobalUrl } from 'src/app/common/url';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SharedDataService } from 'src/app/services/sharedData.service';
import { AdminImportInnerTableComponent } from '../adminImportInnerTable/adminImportInnerTable.component';
import { SharedModalDirective } from '../sharedModal/sharedModal.directive';
import { SharedModalCenterComponent } from '../sharedModal/sharedModalCenter/sharedModalCenter.component';
import { SharedModalClass } from '../sharedModal/sharedModal_class';

@Component({
  selector: 'app-adminImport',
  templateUrl: './adminImport.component.html',
  styleUrls: ['./adminImport.component.css'],
  // animations: [
  //   trigger('detailExpand', [
  //     state('collapsed', style({height: '0px', minHeight: '0'})),
  //     state('expanded', style({height: '*'})),
  //     transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  //   ]),
  // ],
})
export class AdminImportComponent implements OnInit {
  @ViewChild('data',{static:true})sendData!:any;
  @ViewChild('entity',{static:true})setEntity!:string;
  refreshTable:Subject<any>=new Subject();

  constructor(private rest:RestApiService,private sharedData:SharedDataService) { }
  obs$!:Subscription;
  ngOnInit() {
    this.setEntity = "Import";
    this.obs$ = this.getData().subscribe((data:any) =>{
      this.sendData = {entity:'Import',data:data};
    })

    this.obs$ = this.sharedData.currentMessage.subscribe(msg=>{
      if(msg ==='refresh'){
        this.getData().subscribe((data:any)=>{
          this.refreshTable.next(data);
        })
      }
    })
  }

  getData(){
    return this.rest.get(GlobalUrl.get_AllImport_Admin).pipe(
      tap((e)=>console.log(e)),
      mergeMap((data:any) =>data),
      map((data:any) =>{
        return {
          id:data.id,
          address:data.address,
          date:data.date,
          shipper_Name:data.shipperName,
          staff_Name:data.staffName,
        }
      }),
      toArray(),
      shareReplay(),
    )
  }
  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.listData$.filter = filterValue.trim().toLowerCase();
  // }

  // addAndGetId(id:string,action:string,entity:string){
  //   console.log(entity);
  //   const modal = new SharedModalClass(SharedModalCenterComponent,{id:id,action:action,entity:entity});
    
  //   const viewContainerRef = this.appSharedModal.viewContainerRef;
  //   viewContainerRef.clear();

  //   const componentRef = viewContainerRef.createComponent(modal.component);
  //   componentRef.instance.data = modal.data;
  // }

  // insertComponent(index:number,event: any) {
  //   console.log(event.target.innerText);
  //   let converter = this.listData$.data.map(data=>data).filter(e=>e.id===event.target.innerText)
  //   let result;
  //   of(converter).pipe(
  //     shareReplay(),
  //     // tap((e)=>console.log(e)),
  //     mergeMap(data=>data),
  //     map(data=>data.importInfo),
  //   ).subscribe(e=>result = e)
  //   console.log(result);

  //   if (this.expandedRow != null) {
  //     // clear old content
  //     this.rowContainers.toArray()[this.expandedRow].clear();
  //   }

  //   if (this.expandedRow === index) {
  //     this.expandedRow = null;
  //   } else {

  //     const container = this.rowContainers.toArray()[index];
  //     console.log("container", container);
  //     const factory: ComponentFactory<any> = this.resolver.resolveComponentFactory(AdminImportInnerTableComponent);
  //     const inlineComponent = container.createComponent(factory);
  //     // console.log("container", container);

  //     // console.log("factory", factory);

  //     // inlineComponent.instance.id = this.listData$.data[index].id;
  //     // inlineComponent.instance.name = this.listData$.data[index];
  //     inlineComponent.instance.data = result;
  //         //     importInfoId:d.id,
  //     //     name: d.product.name,
  //     //     picture: d.product.picture,
  //     //     priceImport: d.priceImport,
  //     //     quantityImport: d.quantityImport,
  //     //     status: d.status==1?"Đã có":"Chưa có",
  //     console.log("inlineComponent", inlineComponent);
  //     this.expandedRow = index;
  //   }
  // }
  // isNumber(number:any){
  //   if(typeof number === 'number'){
  //     return true;
  //   }
  //   return false;
  // }
  ngOnDestroy() {
    if(this.obs$){
      this.obs$.unsubscribe();
    }
  }
}
