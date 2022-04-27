import { Injectable } from '@angular/core';
import { shareReplay, tap } from 'rxjs';
import { GlobalUrl } from 'src/app/common/url';
import { RestApiService } from 'src/app/services/rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class FirstRowContentService {

  constructor(private rest:RestApiService) { }

  get firstRowDataService(){
    return this.rest.get(GlobalUrl.get_firstRowContent_Admin).pipe(
      shareReplay(),
    )
  }
}
