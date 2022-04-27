import { Injectable } from '@angular/core';
import { map, mergeMap, pluck, shareReplay, take, toArray } from 'rxjs';
import { GlobalUrl } from 'src/app/common/url';
import { RestApiService } from 'src/app/services/rest-api.service';

@Injectable({
  providedIn: 'root',
})
export class FifthRowContentService {
  constructor(private rest: RestApiService) {}

  get CompanyPositionLevel(){
    return this.rest.get(GlobalUrl.get_company_position_level).pipe(
      pluck('firstPyramidChart'),
      mergeMap((data:any) =>data),
      map((data:any) =>{
        return {
          count:data[0],
          level:data[1],
        }
      }),
      toArray(),
      shareReplay(),
    )
  }

  get ProductRating(){
    return this.rest.get(GlobalUrl.get_product_rating_Admin).pipe(
      pluck('firstMultipleAxesChart'),
      mergeMap((data:any) =>data),
      map((data:any) =>{
        return {
          name:data[1],
          fiveStar:data[4],
          fourStar:data[5],
          threeStar:data[6],
          twoStar:data[7],
          oneStar:data[8],
          average:data[2],
          total:data[3],
        }
      }),
      take(10),
      toArray(),
      shareReplay(),
    )
  }
}

export class CompanyPositionLevel{
  count!:number;
  level!:string;
}
export class ProductRating{
  name!:string;
  fiveStar!:number;
  fourStar!:number;
  threeStar!:number;
  twoStar!:number;
  oneStar!:number;
  average!:number;
  total!:number;
}