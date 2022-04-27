import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { Observable, shareReplay } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-fileUpload',
  templateUrl: './fileUpload.component.html',
  styleUrls: ['./fileUpload.component.css'],
})
export class FileUploadComponent implements OnInit {
  // form=this.fb.group({
  //   standard:['']
  // })
  //File fields
  selectedFiles?: File[];
  progressInfos: any;
  message: string[] = [];
  previews: string[] = [];
  imageInfos?: Observable<any>;
  constructor(
    private fb: FormBuilder,
    private uploadService: FileUploadService
  ) {}
  // get standard(){return this.form.get('standard')}
  ngOnInit() {

  }
  selectFiles(event: any): void {  
    this.message = [];
    this.progressInfos;
    this.selectedFiles = event.target.files;
    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          // console.log(e.target.result);
          this.previews.push(e.target.result);
        };
        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }

  uploadFiles(): void {
    this.message = [];
    if (this.selectedFiles) {
      this.upload(this.selectedFiles);
    }
  }
  upload(files: File[]): void {
    for (let i = 0; i < files.length; i++) {
        console.log("name: "+files[i].name);
    }
    if (files) {
      this.uploadService.upload(files).pipe(shareReplay()).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos.value = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            const msg = 'Uploaded the file successfully: '
            this.message.push(msg);
            // this.imageInfos = this.uploadService.getFiles();
          }
        },
        (err: any) => {
          this.progressInfos.value = 0;
          const msg = 'Could not upload the file: ';
          this.message.push(msg);
        });
    }
  }
}
