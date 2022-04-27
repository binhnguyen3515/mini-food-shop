import { filter, Observable, of, shareReplay, Subscription, take, tap, mergeMap, map } from 'rxjs';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { Product } from 'src/app/models/Product';
import { validateAllFormFields, ValidateToday } from 'src/app/common/validators';
import { RestApiService } from 'src/app/services/rest-api.service';
import { GlobalUrl } from 'src/app/common/url';
import { AlertService } from 'src/app/services/alert.service';
import { MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { SharedDataService } from 'src/app/services/sharedData.service';

@Component({
  selector: 'app-productAddAndEdit',
  templateUrl: './productAddAndEdit.component.html',
  styleUrls: ['./productAddAndEdit.component.css']
})
export class ProductAddAndEditComponent implements OnInit {
  baseHostImageUrl = GlobalUrl.baseHostImageUrl;
  //File fields
  selectedFiles?: File[];
  previews: string[] = [];
  imageInfos?: Observable<any>;
  uploadStatus = ""
  linkFileAfterUpload:string[]=[];
  //File fields edge
  //category dropdown
  obs$!:Subscription;
  categoryList$!:any[];
  categorySub$!:Observable<any>;
  // Category[] = [
  //   {id:1,name:"testing1",categorySub:[],categorySubDTO:[]},
  //   {id:2,name:"testing2",categorySub:[],categorySubDTO:[]},
  //   {id:3,name:"testing3",categorySub:[],categorySubDTO:[]},
  //   {id:4,name:"testing4",categorySub:[],categorySubDTO:[]},
  // ];

  // categorySub:CategorySub[] = [
  //   {id:1,name:"catesub1",category:new Category()},
  //   {id:2,name:"catesub2",category:new Category()},
  //   {id:3,name:"catesub3",category:new Category()},
  //   {id:4,name:"catesub4",category:new Category()},
  //   {id:5,name:"catesub5",category:new Category()},
  // ];

  productEmpty:Product[] = [];
  unitList:any[] = [];
  // unitList =[] = [
  //   {id:1,type:"thùng"},
  //   {id:2,type:"hộp"},
  //   {id:3,type:"lít"},
  //   {id:4,type:"kg"},
  //   {id:5,type:"phần"},
  // ];

  availableList:Boolean[]=[true,false];
  //category dropdown
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {id: string},
    private fb: FormBuilder,
    private uploadService: FileUploadService,
    private rest:RestApiService,private message:AlertService,
    private sharedData:SharedDataService) { }
  action:string="";

  productForm = this.fb.group({
    id:[null],
    name:['',[Validators.required,Validators.minLength(2),Validators.maxLength(50)]],
    picture:[null],
    description:[null,[Validators.maxLength(500)]],
    brand:['',[Validators.required,Validators.minLength(2),Validators.maxLength(50)]],
    origin:['',[Validators.required,Validators.minLength(1),Validators.maxLength(30)]],
    isDeleted:[false],
    typeId:['',[Validators.required]],
    type:[''],
    categoryId:['',[Validators.required]],
    categoryName:[''],
    categorySubId:['',[Validators.required]],
    categorySubName:[''],
    files:['',[Validators.required]],
    //detailedProduct
    priceSell:[null,[Validators.min(0),Validators.max(1000000000)]],
    quantity:[0,[Validators.pattern("^[0-9]*$"),Validators.max(1000000)]],
    available:[false,[Validators.required]],
    dateRelease:['',[Validators.required]],
    dateEnd:[''],
    //product Info
    weight:["",[Validators.maxLength(15)]],
    guide:[null,[Validators.maxLength(500)]],
    note:[null,[Validators.maxLength(250)]],
    component:[null,[Validators.maxLength(250)]],
    capacity:[null,[Validators.maxLength(15)]],
    usage:[null,[Validators.maxLength(250)]],
    others:[null,[Validators.maxLength(250)]],
    //discount
    percentage:[0,[Validators.min(0),Validators.max(100)]],
    startDate:[new Date(),[ValidateToday]],
    endDate:['',[Validators.required]],
    productInfoId:[null],
    detailedProductId:[null],
  })
  ngOnInit() {
    //set UnitList
    this.obs$ = this.rest.get(GlobalUrl.get_AllUnitList).pipe(
      tap((e)=>console.log(e))
    ).subscribe((data)=>{
      this.unitList = data as [];
    });
    //set UnitList Edge
    //category handle
    this.obs$ = this.rest.get(GlobalUrl.get_AllCategory_Admin).pipe(
      shareReplay()
    ).subscribe((data)=>{
      this.categoryList$ = data as any[];
      console.log(data);
      
    })
    //category handle edge
    //
    console.log("get id: "+this.data.id);
    if(this.data.id ==='null'){
      this.action = "Add";
    }else{
      this.action = "Edit"
      //bỏ valid file nếu là update
      this.files?.clearValidators();
      this.files?.updateValueAndValidity();
      this.obs$ = this.rest.getOne(GlobalUrl.get_DetailedProduct_Admin,this.data.id).pipe(
        shareReplay(),
        // tap((e)=>console.log(e))
      ).subscribe((data:any)=>{
        let editValue = {
          id:data.id,
          name:data.name,
          picture:data.picture,
          description:data.description,
          brand:data.brand,
          origin:data.origin,
          typeId:data.unitType.id,
          type:data.unitType.type,
          categoryId:data.categorySub.category.id,
          categoryName:data.categorySub.category.name,
          categorySubId:data.categorySub.id,
          categorySubName:data.categorySub.name,

          priceSell:data.productDetailsDTO.priceSell,
          quantity:data.productDetailsDTO.quantity,
          available:data.productDetailsDTO.available,
          dateRelease:data.productDetailsDTO.dateRelease,
          dateEnd:data.productDetailsDTO.dateEnd,
          weight:data.productInfoDTO.weight,
          guide:data.productInfoDTO.guide,
          note:data.productInfoDTO.note,
          component:data.productInfoDTO.component,
          capacity:data.productInfoDTO.capacity,
          usage:data.productInfoDTO.usage,
          others:data.productInfoDTO.others,

          percentage:data.discountDTO?.percentage*100,
          startDate:data.discountDTO?.startDate,
          endDate:data.discountDTO?.endDate,

          productInfoId:data.productInfoDTO.id,
          detailedProductId:data.productDetailsDTO.id
        }
        this.previews = data.pictureDetails
        this.selectCategory({value:data.categorySub.category.id});
        this.productForm.patchValue(editValue);
      });
    }
    

  }
  selectedCateSub:any;
  selectedMainSub:any;
  selectedSubCate(event: MatSelectChange){
    // this.selectedCateSub =  (event.source.selected as MatOption).viewValue,
    console.log(this.selectedCateSub);
    
  }
  selectCategory(event:any){
    console.log(event.value);
    this.selectedMainSub = (event.source?.selected as MatOption)?.viewValue
    this.categorySub$ = of(this.categoryList$).pipe(
      mergeMap((e)=>e),
      filter((e)=>e.id === event.value),
      // tap((e)=>console.log(e)),
      take(1),
      map((e:any)=>e.categorySubDTO),
      )
  }
  getDetailedPicture_WhenEdit_ButNoTChooseImage(){
    return this.previews.map(e=>{
      return{
        name:e,
        isDeleted:false,
        // product:{id:this.data.id}?{id:this.data.id}:null,
      }
    })
  }
  getDetailedPicture(){
    return this.linkFileAfterUpload.map(e=>{
      return{
        name:e,
        isDeleted:false,
        // product:{id:this.data.id}?{id:this.data.id}:null,
      }
    })
  }
  submit(){
    // console.log(this.productForm.value);
    if(this.productForm.valid){
      if((this.selectedFiles && this.action ==='Add')|| this.selectedFiles && this.action ==='Edit'){
        this.obs$ = this.upload(this.selectedFiles).pipe(
          tap((data)=>{
            this.linkFileAfterUpload = data as string[];
          console.log(data);
          
          let product = {
            id:this.id?.value,
            name:this.name?.value,
            picture:this.previews?this.getDetailedPicture()[0].name:null,
            description:this.description?.value,
            brand:this.brand?.value,
            origin:this.origin?.value,
            isDeleted:this.isDeleted?.value,
            categorySub:{
              id:this.categorySubId?.value,
              // name:this.action==='Edit'?this.categorySubName?.value:this.selectedCateSub,
              category:{id:this.categoryId?.value
                // ,name:this.action==='Edit'?this.categoryName?.value:""
              }
            },
            unitType:{id:this.typeId?.value
              // ,type:this.action==='Edit'?this.type?.value:""
            },
            productInfo:[
              {
                id:this.productInfoId?.value,
                weight:this.weight?.value,
                guide:this.guide?.value,
                note:this.note?.value,
                component:this.component?.value,
                capacity:this.capacity?.value,
                usage:this.usage?.value,
                others:this.others?.value,
              }
            ],
            discount:[
              {
                startDate:this.startDate?.value,
                endDate:this.endDate?.value,
                percentage:+this.percentage?.value/100,
                // product:{id:null}
              }
            ],
            detailedProduct:[
              {
                id:this.detailedProductId?.value,
                quantity:+this.quantity?.value,
                priceSell:+this.priceSell?.value,
                dateRelease:this.dateRelease?.value,
                dateEnd:this.dateEnd?.value,
                available:this.available?.value,
              }
            ],
            detailedPicture:this.getDetailedPicture(),
          }
          // console.log(JSON.stringify(product));
          console.log(product);
          if(this.action ==='Add'){
            this.rest.post(GlobalUrl.post_Add_Product,product).subscribe((data)=>{
              this.message.successMessage("Thêm dữ liệu thành công!");
              this.sharedData._sharedMessage("refresh");
              this.resetForm();
              console.log(data); 
            })
          }
          if(this.action ==='Edit'){
            this.rest.put(GlobalUrl.put_Update_Product,product,this.data.id).subscribe((data)=>{
              this.message.successMessage("Cập nhật dữ liệu thành công!");
              this.sharedData._sharedMessage("refresh");
              this.resetForm();
              console.log(data); 
            })
          }
          })
        )
        .subscribe()
      }

      if(!this.selectedFiles && this.action ==='Edit'){
        let product = {
          id:this.id?.value,
          name:this.name?.value,
          picture:this.previews[0],
          description:this.description?.value,
          brand:this.brand?.value,
          origin:this.origin?.value,
          isDeleted:this.isDeleted?.value,
          categorySub:{
            id:this.categorySubId?.value,
            // name:this.action==='Edit'?this.categorySubName?.value:this.selectedCateSub,
            category:{id:this.categoryId?.value
              // ,name:this.action==='Edit'?this.categoryName?.value:""
            }
          },
          unitType:{id:this.typeId?.value
            // ,type:this.action==='Edit'?this.type?.value:""
          },
          productInfo:[
            {
              id:this.productInfoId?.value,
              weight:this.weight?.value,
              guide:this.guide?.value,
              note:this.note?.value,
              component:this.component?.value,
              capacity:this.capacity?.value,
              usage:this.usage?.value,
              others:this.others?.value,
            }
          ],
          discount:[
            {
              startDate:this.startDate?.value,
              endDate:this.endDate?.value,
              percentage:+this.percentage?.value/100,
              // product:{id:null}
            }
          ],
          detailedProduct:[
            {
              id:this.detailedProductId?.value,
              quantity:+this.quantity?.value,
              priceSell:+this.priceSell?.value,
              dateRelease:this.dateRelease?.value,
              dateEnd:this.dateEnd?.value,
              available:this.available?.value,
            }
          ],
          detailedPicture:this.getDetailedPicture_WhenEdit_ButNoTChooseImage(),
        }
        console.log(product);
        this.rest.put(GlobalUrl.put_Update_Product,product,this.data.id).subscribe((data)=>{
          this.message.successMessage("Cập nhật dữ liệu thành công!");
          this.sharedData._sharedMessage("refresh");
          this.resetForm();
          console.log(data); 
        })
      }
    }else{
      console.log("invalid");
      
      validateAllFormFields(this.productForm);
    }
  }
  resetForm(){
    this.productForm.reset();
    this.previews = [];
    this.ngOnInit();
  }
  cancelDialog(){
    // this.rest.RefreshRequest.next();
  }
  selectedFileAction:string = '';
  //file handle 
  selectFiles(event: any): void {
    this.selectedFileAction = 'choosing'
    this.selectedFiles = event.target.files;
    console.log(this.selectFiles);
    
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

  // uploadFiles(): void {
  //   if (this.selectedFiles) {
  //     this.upload(this.selectedFiles);
  //   }
  // }
  upload(files: File[]):Observable<any> {
    // for (let i = 0; i < files.length; i++) {
    //     console.log("name: "+files[i].name);
    // }
    // if (files) {
    return this.uploadService.upload(files).pipe(shareReplay())
    // .subscribe(
    //     (event: any) => {
          
    //       console.log(event) 
    //     });
    // }
  }
  //file handle edge

  ngOnDestroy(){
    if(this.obs$){
      this.obs$.unsubscribe();
    }
  }

  get id(){return this.productForm.get('id')};
  get name(){return this.productForm.get('name')};
  get picture(){return this.productForm.get('picture')};
  get description(){return this.productForm.get('description')};
  get brand(){return this.productForm.get('brand')};
  get origin(){return this.productForm.get('origin')};
  get isDeleted(){return this.productForm.get('isDeleted')};
  get typeId(){return this.productForm.get('typeId')};
  get type(){return this.productForm.get('type')};
  get categoryId(){return this.productForm.get('categoryId')};
  get categoryName(){return this.productForm.get('categoryName')};
  get categorySubId(){return this.productForm.get('categorySubId')};
  get categorySubName(){return this.productForm.get('categorySubName')};
  get files(){return this.productForm.get('files')};
  get priceSell(){return this.productForm.get('priceSell')};
  get quantity(){return this.productForm.get('quantity')};
  get available(){return this.productForm.get('available')};
  get dateRelease(){return this.productForm.get('dateRelease')};
  get dateEnd(){return this.productForm.get('dateEnd')};
  get weight(){return this.productForm.get('weight')};
  get guide(){return this.productForm.get('guide')};
  get note(){return this.productForm.get('note')};
  get component(){return this.productForm.get('component')};
  get capacity(){return this.productForm.get('capacity')};
  get usage(){return this.productForm.get('usage')};
  get others(){return this.productForm.get('others')};
  get percentage(){return this.productForm.get('percentage')};
  get startDate(){return this.productForm.get('startDate')};
  get endDate(){return this.productForm.get('endDate')};
  get productInfoId(){return this.productForm.get('productInfoId')};
  get detailedProductId(){return this.productForm.get('detailedProductId')};

}
