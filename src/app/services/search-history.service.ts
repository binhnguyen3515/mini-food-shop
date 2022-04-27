import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchHistoryService {
  searchNames:any[] = [];
  searchHistory$ = new BehaviorSubject<any[]>([]);
  constructor(){this.loadFromLocalStorage()}
  addSearchItem(name:string){
    if(typeof name !== 'object'){
      const exist = this.searchNames.find((e)=>e.name===name)
      if(!exist && name.trim().length>0){
        this.searchNames.push({name:name.trim(),date:new Date().getTime()});
        this.saveToLocalStorage();
      }
    }else{

    }
    
  }

  get searchHistoryNames():string[]{
    const json = localStorage.getItem('searchHistory');
    return json ? JSON.parse(json) : [];
  }

  saveToLocalStorage() {
    this.searchHistory$.next(this.searchNames);
    localStorage.setItem('searchHistory', JSON.stringify(this.searchNames));
  }

  loadFromLocalStorage() {
    const json = localStorage.getItem('searchHistory');
    this.searchNames = json ? JSON.parse(json) : [];
    this.searchHistory$.next(this.searchNames);
  }

  get loadHistory():Observable<any>{
    const json = localStorage.getItem('searchHistory');
    return of(json ? JSON.parse(json) : []);
  }
  
}
