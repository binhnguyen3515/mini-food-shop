import { SharedModalClass } from './../sharedModal/sharedModal_class';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { of, Subject, Subscription, tap } from 'rxjs';
import { SharedModalCenterComponent } from '../sharedModal/sharedModalCenter/sharedModalCenter.component';
import { SharedModalDirective } from '../sharedModal/sharedModal.directive';
import moment from 'moment';
import { SharedDataService } from 'src/app/services/sharedData.service';
import { AuthService } from 'src/app/guards/auth.service';
import { TokenStorageService } from 'src/app/guards/tokenStorage.service';
import { GlobalUrl } from 'src/app/common/url';

@Component({
  selector: 'app-sharedTable',
  templateUrl: './sharedTable.component.html',
  styleUrls: ['./sharedTable.component.css']
})
export class SharedTableComponent implements OnInit,OnDestroy {
  baseHostImageUrl = GlobalUrl.baseHostImageUrl;
  @Input()data!:any;
  // @Input()ngSwitch: any;
  @Input()refresh:Subject<any> = new Subject();

  constructor(private sharedData:SharedDataService,public auth:AuthService,public tokenStorage: TokenStorageService) { }
  @ViewChild(MatPaginator,{ static: true })paginator!:MatPaginator;
  @ViewChild(MatSort,{ static: true })sort!:MatSort;
  @ViewChild(SharedModalDirective,{ static: true })appSharedModal!:SharedModalDirective;
  obs$!:Subscription;
  list!:MatTableDataSource<any>;
  cols!:string[];
  selectedRow:any;
  entity="";
  ngOnInit() {
    this.entity = this.data.entity;
    console.log(this.entity);
    
    //get columns from data (Json)
    this.obs$ = of(this.data.data).subscribe((data:any) =>{
      
      this.cols = (data as any[])
      .flatMap(data=>Object.keys(data))
      .filter((value,index,self)=>self.indexOf(value)===index)
      //
      this.cols = [...this.cols,"action"];
      this.list = new MatTableDataSource(data as any[]);
      this.list.paginator = this.paginator;
      this.list.sort = this.sort;
    })
    //refresh data
    this.obs$ = this.refresh.pipe(tap((data:any)=>{
      this.cols = (data as any[])
      .flatMap(data=>Object.keys(data))
      .filter((value,index,self)=>self.indexOf(value)===index)
      //
      this.cols = [...this.cols,"action"];
      this.list = new MatTableDataSource(data as any[]);
      this.list.paginator = this.paginator;
      this.list.sort = this.sort;
    })).subscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.list.filter = filterValue.trim().toLowerCase();
  }

  addAndGetId(id:string,action:string,entity:string){
    console.log(entity);
    const modal = new SharedModalClass(SharedModalCenterComponent,{id:id,action:action,entity:entity});
    
    const viewContainerRef = this.appSharedModal.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(modal.component);
    componentRef.instance.data = modal.data;
  }
  isNumber(number:any){
    if(typeof number === 'number' && number !== null){
      return true;
    }
    return false;
  }

  isDate(date:any){
    var dateWrapper = new Date(date.toString());
    if(date.indexOf("%")>-1||date==0){
      return false;
    }
    if(!isNaN(dateWrapper.getDate())){
      return true;
    }
    // console.log("not date");
    // if(Object.prototype.toString.call(date) === '[object Date]){
    //   return true;
    // }
    // if (date instanceof Date && date.getTime()) {
      
    //   console.log("is date!");
    //   return true;
    // }
    return false;
  }

  ngOnDestroy(){
    if(this.obs$){
      this.obs$.unsubscribe();
    }
  }
}
