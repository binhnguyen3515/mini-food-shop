import { Injectable } from '@angular/core';
import { combineLatest, groupBy, map, mergeMap, of, pluck, reduce, shareReplay, toArray, zip } from 'rxjs';
import { GlobalUrl } from 'src/app/common/url';
import { RestApiService } from 'src/app/services/rest-api.service';
import { UtilityService } from 'src/app/services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class FourthRowContentService {

  constructor(private rest: RestApiService,private utilityService: UtilityService) { }

  RevenueAndExpensesData(dateRange:string){
    const revenue$ = this.revenueMergeDate(dateRange);
    const expense$ = this.expenseMergeDate(dateRange);

    const merge$ = zip([revenue$, expense$]).pipe(
      mergeMap((data:any) =>data),
      mergeMap((data:any) =>data),
      groupBy((data:any)=>data.date),
      mergeMap(groupedEntities$ => groupedEntities$.pipe(
        reduce((merge, entity:any)=>({...merge,...entity}))
      )),
      toArray(),
    )

    return merge$;
  }

  revenueMergeDate(dateRange:string){
    const date$ = this.getDateRange(dateRange);
    const revenue$ = this.Revenue;

    const merge$ = combineLatest([date$,revenue$]).pipe(
      map(([date,revenue_])=>{
        return date.map(item=>({
          date:item.date,
          revenue:revenue_.filter((v:any)=>v.date === item.date)[0]?.revenue?revenue_.filter((v:any)=>v.date === item.date)[0].revenue:0,
        }))
      })
    )
    return merge$
  }

  expenseMergeDate(dateRange:string){
    const date$ = this.getDateRange(dateRange);
    const expense$ = this.Expense;

    const merge$ = combineLatest([date$,expense$]).pipe(
      map(([date,expense_])=>{
        return date.map(item=>({
          date:item.date,
          expense:expense_.filter((v:any)=>v.date === item.date)[0]?.expense?expense_.filter((v:any)=>v.date === item.date)[0].expense:0,
        }))
      })
    )
    return merge$
  }

  get Revenue(){
    return this.rest.get(GlobalUrl.get_Revenue_Expense_Admin).pipe(
      pluck('firstSpineChartRevenue'),
      mergeMap((data:any) =>data),
      map((data:any)=>{
        return{
          date:this.utilityService.dayFormat('YYYY-MM-DD','DD-MM-YYYY',data[0]),
          revenue:data[1],
        }
      }),
      toArray(),
      shareReplay(),
    )
  }
  get Expense(){
    return this.rest.get(GlobalUrl.get_Revenue_Expense_Admin).pipe(
      pluck('firstSpineChartExpense'),
      mergeMap((data:any) =>data),
      map((data:any)=>{
        return{
          date:this.utilityService.dayFormat('YYYY-MM-DD','DD-MM-YYYY',data[0]),
          expense:data[1],
        }
      }),
      toArray(),
      shareReplay(),
    )
  }

  getDateRange(value:any){
    return this.rest.post(GlobalUrl.post_getDateRange_Admin,value).pipe(
      mergeMap((data:any)=>data),
      map((data:any)=>{
        return {date:this.utilityService.dayFormat('YYYY-MM-DD','DD-MM-YYYY',data)}
      }),
      toArray(),
      shareReplay(),
    )
  }

  get top10Sold(){
    return this.rest.get(GlobalUrl.get_Top_10_Sold_Admin).pipe(
      pluck('secondBarChart'),
      mergeMap((data:any)=>data),
      map((data:any)=>{
        return {
          name:data[0],
          value:data[1],
        }
      }),
      toArray(),
      shareReplay(),
    )
  }

  top10SoldByDateRange(value:any){
    return this.rest.post(GlobalUrl.post_Top_10_Sold_Date_Range_Admin,value).pipe(
      pluck('secondBarChart'),
      mergeMap((data:any)=>data),
      map((data:any)=>{
        return {
          name:data[0],
          value:data[1],
        }
      }),
      toArray(),
      shareReplay(),
    )
  }
}

export class ExpenseAndRevenue{
  date!:string;
  expense!:number;
  revenue!:number
}

export class TopSold{
  name!:string;
  value!:number;
}