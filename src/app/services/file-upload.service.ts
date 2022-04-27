import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalUrl } from '../common/url';
import { RestApiService } from './rest-api.service';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private rest:RestApiService) {}

  // upload(file:File):Observable<any>{
  //   const formData:FormData = new FormData();
  //   formData.append('file',file);
  //   return this.rest.post(GlobalUrl.post_uploadFiles,formData);
  // }

  upload(files:File[]):Observable<any>{
    let formData:FormData = new FormData();
    for (const file of files){
      formData.append("files",file);
    }
    return this.rest.post(GlobalUrl.post_uploadFiles,formData);
  }

  uploadOneFile(file:File):Observable<any>{
    let formData:FormData = new FormData();
    formData.append("files",file);
    return this.rest.post(GlobalUrl.post_uploadFiles,formData);
  }
  getFiles():Observable<any>{
    return this.rest.get(GlobalUrl.get_Files);
  }
}
