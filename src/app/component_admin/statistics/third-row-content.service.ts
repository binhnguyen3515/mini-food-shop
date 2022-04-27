import { Injectable } from '@angular/core';
import { combineLatest, map, mergeMap, pluck, shareReplay, toArray } from 'rxjs';
import { groupBy, reduce, take, tap } from 'rxjs/operators';
import { GlobalUrl } from 'src/app/common/url';
import { RestApiService } from 'src/app/services/rest-api.service';
import moment from 'moment';
import { UtilityService } from 'src/app/services/utility.service';
@Injectable({
  providedIn: 'root',
})
export class ThirdRowContentService {
  constructor(private rest: RestApiService,private utilityService: UtilityService) {}

  get invoiceByStatusService(){
    return this.rest.get(GlobalUrl.get_InvoiceByStatus_Admin).pipe(
      pluck("firstBarChart"),
      mergeMap((data:any) => data),
      map((data:any) =>{
        return {
          name:data[0],
          percent:data[1],
        }
      }),
      toArray(),
      shareReplay(),
      map((data:any)=>data as InvoiceData[]),
    )
  }

  get ImportedByCateOverTheTimeData(){
    const date$ = this.dateGroupByImport;
    const value$ = this.importedByCateOverTheTime;

    const merge$ = combineLatest([date$,value$]).pipe(
      map(([date,value])=>{
        return date.map(item=>({
          val:this.converter(value,item),
        }))
      }),
      // tap((data)=>console.log(data)),
      mergeMap((data:any)=>data),
      // distinctUntilChanged(),
      map((data:any)=>data.val),
      // distinctUntilChanged(),
      toArray(),
      mergeMap((data:any)=>data),
      mergeMap((data:any)=>data),
      groupBy((data:any)=>data.date),
      take(5),
      mergeMap(groupedEntities$ => groupedEntities$.pipe(
        reduce((merged, entity:any) => ({...entity,...merged }), {}))
      ),
      toArray(),
    )
    return merge$;
  }

  get importedExpenseByCateOverTheTimeData(){
    return this.importedExpenseByCateOverTheTime.pipe(
      mergeMap((data:any)=>data),
      groupBy((data:any)=>data.date),
      take(5),
      mergeMap(groupedEntities$ => groupedEntities$.pipe(
        reduce((merged, entity:any) =>({...entity,...merged}), {})
      )),
      toArray(),
      // tap((e)=>console.log(e)),
    )
  }
  converter(value:any,item:any){
    return value.filter((v:any)=>v.date===item.date)
    .map((v:any)=>{
      return{
        ["categoryID"+v.name]:v.quantity,
        date:this.utilityService.dayFormat("YYYY-MM-DD","DD-MM-YYYY",v.date)
      }
    })
  }
  get importedByCateOverTheTime(){
    return this.rest.get(GlobalUrl.get_ImportedByCategoryOverTheTime_Admin).pipe(
      pluck('firstStackedBarChart'),
      mergeMap((data:any) => data),
      map((data:any) => {
        return{
          date:data[0],
          name:data[1],
          quantity:data[2],
        }
      }),
      toArray(),
      shareReplay(),
    )
  }

  get importedExpenseByCateOverTheTime(){
    return this.rest.get(GlobalUrl.get_ImportedExpenseByCategoryOverTheTime_Admin).pipe(
      pluck('firstSideBySideStackBar'),
      mergeMap((data:any) => data),
      map((data:any) => {
        return{
          date:this.utilityService.dayFormat("YYYY-MM-DD","DD-MM-YYYY",data[0]),
          ["categoryID"+data[1]]:data[2],
          quantity:data[2],
        }
      }),
      toArray(),
      shareReplay(),
    )
  }

  get dateGroupByImport(){
    return this.rest.get(GlobalUrl.get_ImportTimeGroupBy_Admin).pipe(
      mergeMap((data:any)=>data),
      map((data:any)=>{
        return {
          date:data
        }
      }),
      toArray(),
      shareReplay(),
    )
  }

  
}

export class InvoiceData {
  name!: string;
  percent!: number;
}
export class CategoryByProductNumber{
  categoryID1!:number;
  categoryID2!:number;
  categoryID3!:number;
  categoryID4!:number;
  categoryID5!:number;
  categoryID6!:number;
  categoryID7!:number;
  categoryID8!:number;
  categoryID9!:number;
  categoryID10!:number;

  date!:string;
}