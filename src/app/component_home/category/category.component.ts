import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { GlobalUrl } from 'src/app/common/url';
import { Category } from 'src/app/models/Category';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit ,OnDestroy {
  cateNull:any;
  cate$:Category[] = [];
  $getAllCate:any;
  constructor(private rest:RestApiService) {
    
   }

  ngOnInit() {
    this.$getAllCate= this.rest.get(GlobalUrl.get_AllCategory).subscribe(data=>{
      this.cate$ = data as Category[];      
    })
    // console.log("runnng1");
    // this.$getAllCate= this.rest.get(GlobalUrl.get_AllCategory).pipe(map(data=>{
    //   console.log(this.cate$);
    //   console.log("runnng");
    //   return this.cate$ = data as Category[];;
      
    // }))
    // this.$getAllCate.subscribe((data: any)=>{console.log(data);
    // })
    
  }

  ngOnDestroy() {
    this.$getAllCate.unsubscribe();
  }
}
