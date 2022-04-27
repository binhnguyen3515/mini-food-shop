import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, combineLatest, debounceTime, distinctUntilChanged, filter, first, from, fromEvent, fromEventPattern, interval, last, map, mapTo, merge, mergeAll, mergeMap, Observable, of, pluck, share, shareReplay, startWith, Subject, Subscription, switchMap, take, tap, throttleTime, timer, toArray, withLatestFrom } from 'rxjs';
import { removeUnicode } from 'src/app/common/removeUnicode';
import { GlobalUrl } from 'src/app/common/url';
import { AuthService } from 'src/app/guards/auth.service';
import { TokenStorageService } from 'src/app/guards/tokenStorage.service';
import { ProductDetailsDtoById } from 'src/app/models-dto/productDetailsDTObyID';
import { CartService } from 'src/app/services/cart.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SearchHistoryService } from 'src/app/services/search-history.service';
import { SharedDataService } from 'src/app/shared/sharedData.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,AfterViewInit {
  baseHostImageUrl = GlobalUrl.baseHostImageUrl;
  // toggleModal!:string;
  cartItems:ProductDetailsDtoById[] = [];
  totalItems:number=0;
  @ViewChild('inputSearchName')inputSearchName!:ElementRef;
  onSearching$!:Subscription;
  
  constructor(private router:Router,public auth:AuthService,
    public cartService:CartService,
    public sharedData:SharedDataService,
    public tokenStorage: TokenStorageService,
    private rest:RestApiService,private cd:ChangeDetectorRef,
    private searchService:SearchHistoryService) { }

    searchName!:string;
    listNameAfterSearch$!:Observable<any>;

    listHistoryName$!:Observable<any>;

    hideSearchBoxA = true;
    hideSearchBoxB = true;
  ngOnInit() {
    // console.log(this.toggleModal);
    this.cartService.numberOfItems.subscribe(data=>{
      this.cartItems = data;
      this.totalItems = data.map(item=>item.productDetailsDTO.quantity).reduce((sum, qty)=>sum+=qty,0);
    })
    
    // this.cd.detectChanges();
    // this.onSearching$ = fromEvent(this.inputSearchName.nativeElement!,"keydown")
    // .pipe(shareReplay())
    // .pipe(
    //   debounceTime(300),
    //   pluck('target','value'),
    //   distinctUntilChanged(),
    //   tap((a)=>{this.getName(a);this.hideSearchBoxA=true;this.hideSearchBoxB=false})
    // ).subscribe(()=>{
    //   if(this.searchName.length === 0){
    //     this.hideSearchBoxA=false;this.hideSearchBoxB=true;
    //   }else{
    //     this.hideSearchBoxA=true;this.hideSearchBoxB=false;
    //   }
    // });

    // this.onSearching$ = fromEvent(this.inputSearchName.nativeElement!,"focus")
    // .pipe(shareReplay())
    // .pipe(
    //   debounceTime(50),
    //   tap((a)=>{this.loadStorageName(a);this.hideSearchBoxB=true;this.hideSearchBoxA=false})
    // ).subscribe(()=>{

    // });

    // const keyDownEvent = fromEvent(this.inputSearchName.nativeElement!,"keydown")
    // const mouseFocus = fromEvent(this.inputSearchName.nativeElement!,"focus")
    // const events = ['keydown','focus'];
    // this.onSearching$ = from(events)
    // .pipe(
    //   mergeMap(event=>fromEvent(this.inputSearchName.nativeElement,event)),
    //   map((event:any)=>{
    //     if(event instanceof KeyboardEvent){
    //      of(event)
    //       .pipe(
    //         tap((a)=>console.log(a)),
    //         debounceTime(300),
    //         pluck('target','value'),
    //         distinctUntilChanged(),
    //         tap((a)=>this.getName(a)),
            
    //         // tap((a)=>console.log(a)),
           
    //       )
    //     }else{
    //       console.log("yes");
          
    //     }
    //   })
    // ).subscribe({})
  }
  
  getName(name:any){
    if(name.length !== 0){
      this.searchName = name;
      this.listNameAfterSearch$ = this.rest.get(GlobalUrl.get_AllProduct_By_Name+"?name="+name.toLowerCase()
      )
    }
  }
  loadStorageName(name:any){
    this.searchName = name;
    this.listHistoryName$ = this.searchService.loadHistory
    .pipe(
      // filter((data)=>data.name > 0),
      debounceTime(300),
      map((arr:any)=>arr.sort((a:any,b:any)=>b.date-a.date)),
      mergeMap((data:any) => data),
      take(6),
      toArray(),
      // tap((a)=>console.log("history:"+JSON.stringify(a))),
      shareReplay(),
    )
  }
  submitSearch(){
    // this.searchService.addSearchItem(this.searchName as any)
    this.searchService.addSearchItem(this.searchName)
  }
  removeItem(id:number) {
    this.cartService.removeItemPopUp(id);
  }
  pasteName$!:Observable<string>
  pasteName(name:string){
    this.searchName = name;
    this.pasteName$ = of(name);
  }
  searchByNameSubmit(event:any){
    return of(event.target.value)
    .pipe(throttleTime(1000))
    .subscribe(console.log)
    
  }
  
  ngAfterViewInit(): void {
    // this.onSearching$ = fromEvent(this.inputSearchName.nativeElement!,"keydown")
    // .pipe(shareReplay())
    // .pipe(
    //   debounceTime(300),
    //   pluck('target','value'),
    //   distinctUntilChanged(),
    //   tap((a)=>{this.getName(a);this.hideSearchBoxA=true;this.hideSearchBoxB=false})
    // ).subscribe(()=>{
    //   if(this.searchName.length === 0){
    //     this.hideSearchBoxA=false;this.hideSearchBoxB=true;
    //   }else{
    //     this.hideSearchBoxA=true;this.hideSearchBoxB=false;
    //   }
    // });
    const search$ = fromEvent(this.inputSearchName.nativeElement!,"keydown").pipe(share());
    const searchKeyEnter$ = search$.pipe(filter((e:any) => e.keyCode === 13 || e.which === 13))
    const searchText$ = search$.pipe(filter((e:any)=> e.keyCode !==13 && e.which !== 13),
    debounceTime(300))

    this.onSearching$ = merge(searchKeyEnter$.pipe(mapTo('enter')),searchText$.pipe(mapTo('search')))
    .pipe(
      withLatestFrom(search$),
      filter(([origin,data]:[string,any])=>data.target.value.length>1),
      distinctUntilChanged(),
      map(([origin,data])=>{
        if(origin === 'search'){
          this.getName(data.target.value);this.hideSearchBoxA=true;this.hideSearchBoxB=false
          console.log("keyboard:"+data.target.value);
        }else{
          console.log("Enter pressing");
          this.submitSearch();
          this.router.navigate(['/home/search/'+data.target.value]);
        }
      })
    ).subscribe(()=>{
      if(this.searchName.length === 0){
        this.hideSearchBoxA=false;this.hideSearchBoxB=true;
      }else{
        this.hideSearchBoxA=true;this.hideSearchBoxB=false;
      }
    });

    this.onSearching$ = fromEvent(this.inputSearchName.nativeElement!,"focus")
    .pipe(shareReplay())
    .pipe(
      debounceTime(50),
      tap((a)=>{this.loadStorageName(a);this.hideSearchBoxB=true;this.hideSearchBoxA=false})
    ).subscribe(()=>{

    });
  }

  // checkOrder(){
  //   if(!this.auth.isLoggedIn()){
  //     this.toggleModal = "open";
  //     console.log(this.toggleModal);
  //   }else{
  //     this.router.navigate(['/home/paymentLog'])
  //   }
  // }

  // onCloseAction(item:any){
  //   this.toggleModal = item;
  // }
  ngOnDestroy() {
    if(this.onSearching$){
      this.onSearching$.unsubscribe();
    }
  }
  typeOfName(name:any){
    if(typeof name === 'object' || typeof name === 'undefined'){
      return "";
    }
    return name
  }
}
