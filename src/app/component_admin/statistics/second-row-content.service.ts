import { UtilityService } from './../../services/utility.service';
import { RestApiService } from '../../services/rest-api.service';
import { Injectable } from '@angular/core';
import { GlobalUrl } from 'src/app/common/url';
import { combineLatest, combineLatestWith, map, mergeMap, pluck, shareReplay, take, tap, toArray } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecondRowContentService {

  constructor(private rest:RestApiService,private utilityService: UtilityService) { }

  // 1st bar chart
  get categoryService() {
    return this.rest.get(GlobalUrl.get_ProductSoldByCategory_Admin).pipe(
      pluck('firstBarChart'),
      mergeMap((data:any)=>data),
      map((data:any)=>{
        return {
          name:data[0],
          value:data[1],
        }
      }),
      toArray(),
      shareReplay(),
      ).pipe(map((data:any)=>data as CategoryData[]))
    }
    
  categoryService_DateRange(value:any){
    return this.rest.post(GlobalUrl.post_ProductSoldByCategory_Date_Range_Admin,value).pipe(
      pluck('firstBarChart'),
      mergeMap((data:any)=>data),
      map((data:any)=>{
        return {
          name:data[0],
          value:data[1],
        }
    }),
    toArray(),
    shareReplay(),
    ).pipe(map((data:any)=>data as CategoryData[]))
  }
  // 1st bar chart edge

  // 1st line chart
  getFirstChartData(value:any){

    const date$ = this.getDateRange(value);
    const value$ = this.IncomeByDate;

    const merge$ = combineLatest([date$,value$]).pipe(
      // tap((data)=>console.log(data)),
      map(([date,value])=>{
        return date.map(item=>({
          name:this.utilityService.dayFormat("YYYY-MM-DD","DD-MM-YYYY",item.date),
          val:value.filter((v:any)=>v.date === item.date)[0]?.income?value.filter((v:any)=>v.date === item.date)[0].income:0
        }))
      })).pipe(map((data:any)=>data as IncomeByDateData[]))
    return merge$;
  }
  get IncomeByDate(){
    return this.rest.get(GlobalUrl.get_IncomeByDate_Admin).pipe(
      pluck('firstLineChart'),
      mergeMap((data:any)=>data),
      map((data:any)=>{
        return{
          date:data[0],
          income:data[1],
        }
      }),
      toArray(),
      shareReplay(),
      // tap((e)=>console.log(e)),
    )
  }

  getDateRange(value:any){
    return this.rest.post(GlobalUrl.post_getDateRange_Admin,value).pipe(
      mergeMap((data:any)=>data),
      map((data:any)=>{
        return {date:data}
      }),
      toArray(),
      shareReplay(),
    )
  }
  // 1st line chart edge
}
export class CategoryData{
  name!:string;
  value!:number;
}

export class IncomeByDateData{
  name!:string;
  val!:number
}