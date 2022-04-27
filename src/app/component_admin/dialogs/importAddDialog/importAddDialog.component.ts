import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, mergeMap, Observable, shareReplay, startWith, Subscription, tap, toArray, of, pluck, filter } from 'rxjs';
import { GlobalUrl } from 'src/app/common/url';
import { findInvalidControlsRecursive, validateAllFormFields } from 'src/app/common/validators';
import { AlertService } from 'src/app/services/alert.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SharedDataService } from 'src/app/services/sharedData.service';
import { ValidationService } from 'src/app/services/validation.service';

@Component({
  selector: 'app-importAddDialog',
  templateUrl: './importAddDialog.component.html',
  styleUrls: ['./importAddDialog.component.css']
})
export class ImportAddDialogComponent implements OnInit,OnDestroy {
  baseHostImageUrl = GlobalUrl.baseHostImageUrl;
  obs$!:Subscription;
  getProductID!:number;
  productIDArray:number[]=[];
  statusList:number[]=[1,2,3,4];
  availableList:Boolean[]=[true,false];
  constructor(private rest:RestApiService,private fb:FormBuilder,private validationService:ValidationService,
    private message:AlertService,private sharedData:SharedDataService) { 
    //search product name
    this.obs$ = this.rest.get(GlobalUrl.get_AllProduct_Admin).pipe(
      mergeMap((data:any)=>data),
      // filter((e:any)=>e.importInfo!==null),
      map((data:any)=>{
        return {
          id:data.id,
          name:data.name,
          picture:data.picture,
          isImported:data.importInfo?'Old':'New'
        }
      }),
      toArray(),
      shareReplay(),
      tap((e:any)=>this.listNameProduct= e)
    ).subscribe(()=>{
      this.nameGroupOptions$ = this.nameGroup!.valueChanges.pipe(
        startWith(''),
        map(name => (name ? this._filterStates(name) : this.listNameProduct.slice())),
        tap((e)=>{
          try {
            this.getProductID=e[0].id
          } catch (error) {
            
          }
        })
      );
    });
    //search product name edge
  }
  productByIdArray!:FormArray;
  formImport = this.fb.group({
    id:['',Validators.compose([Validators.required,Validators.pattern(/[iI]{1}[pP]{1}[0-9]{3,5}$/)]),this.validationService.isExistedImportID().bind(this)],
    address:['',[Validators.required,Validators.minLength(10),Validators.maxLength(50)]],
    date:['',[Validators.required]],
    shipperName:['',[Validators.required,Validators.minLength(2),Validators.maxLength(50)]],
    staffName:['',[Validators.required,Validators.minLength(2),Validators.maxLength(50)]],
    productByIdArray:this.fb.array([this.createProductByIdForm],[Validators.required])
  })
  get createProductByIdForm():FormGroup {
    return this.fb.group({
      id:[''],
      name:['',[Validators.required,Validators.minLength(2),Validators.maxLength(250)]],
      picture:[''],
      
      priceImport:['',[Validators.required,Validators.min(0),Validators.max(1000000000)]],
      quantityImport:['',[Validators.required,Validators.pattern("^[0-9]*$"),Validators.max(1000000000)]],
      importID:[''],
      productID:[''],
      status:[1],

      quantity:[''],
      priceSell:['',[Validators.required,Validators.min(0),Validators.max(1000000000)]],
      available:[true],
      isDeleted:[false],
      dateRelease:[new Date(),[Validators.required]],
      dateEnd:['',[Validators.required]],
      productID_FK_Detailed:[''],
      importInfoID_FK:[''],

      detailedProductID:[''],
    })
  }
  //search product name
  nameSearchGroup = this.fb.group({
    nameGroup:['',[Validators.required]]
  })
  listNameProduct:any[] = [{id:'',name:'',picture:''}]
  nameGroupOptions$!:Observable<any>;

  private _filterStates(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.listNameProduct.filter(e => e.name.toLowerCase().includes(filterValue));
  }
  //search product name edge

  ngOnInit() {

  }
  tabs:string[] = ['No Product'];
  selected = new FormControl(0);
  value!:number;
  productChooseStacking:any[]=[];
  getProductArray(){
    if(this.nameSearchGroup.valid){
      if(this.productIDArray.indexOf(this.getProductID)>-1){
        console.log("this product id is being used!");
      }else{
        this.obs$ = this.rest.getOne(GlobalUrl.get_DetailedProduct_Admin,this.getProductID.toString()).pipe(
          map((data:any)=>{
            return {
              id:null,
              name:data.name,
              picture:data.picture,

              priceImport:null,
              quantityImport:null,
              importID:null,
              productID:data.id,
              status:data.productDetailsDTO.quantity>0?2:1,

              quantity:data.productDetailsDTO.quantity?data.productDetailsDTO.quantity:0,
              priceSell:data.productDetailsDTO.priceSell?data.productDetailsDTO.priceSell:null,
              available:data.productDetailsDTO.available?data.productDetailsDTO.available:false,
              isDeleted:false,
              dateRelease:data.productDetailsDTO.dateRelease?data.productDetailsDTO.dateRelease:null,
              dateEnd:data.productDetailsDTO.dateEnd?data.productDetailsDTO.dateEnd:null,
              productID_FK_Detailed:data.id,
              importInfoID_FK:null,

              detailedProductID:data.productDetailsDTO.id,
            }
          }),
          tap((e:any)=>{
            
            this.productChooseStacking.push(e)
            console.log(this.productChooseStacking);
            console.log("clean id");
            if(this.tabs.indexOf('No Product')>-1){
              this.tabs[0] = `ProductID: ${this.getProductID}`;
              this.productIDArray.push(this.getProductID);
              this.formArrayProduct.patchValue(this.productChooseStacking);
            }else{
              this.tabs.push(`ProductID: ${this.getProductID}`);
              this.selected.setValue(this.tabs.length-1);
              this.productIDArray.push(this.getProductID);

              this.formArrayProduct.push(this.createProductByIdForm);
              this.formArrayProduct.patchValue(this.productChooseStacking);
              // this.formArrayProducts = this.formArrayProduct;
              // this.createProductByIdForm.patchValue(e);
            }
          })
        ).subscribe()
      }
    }else{
      validateAllFormFields(this.nameSearchGroup);
    }
  }
  removeTab(index:number,id:number){
    this.tabs.splice(index,1);
    this.formArrayProduct.removeAt(index);
    console.log(id);
    console.log(this.productIDArray);
    
    this.productIDArray = this.productIDArray.filter(e=>e!==id);
    this.productChooseStacking = this.productChooseStacking.filter((e,i)=>i!==index);
  }

  patchInputValue(field:string, index:number){
    let value = this.formArrayProduct.at(index).get(field)?.value;
    console.log(value);
    
    this.productChooseStacking.forEach((e,i)=>{
      if(index === i){
        e[field] = value;
        return;
      }
    })
  }

  getDetailedProduct(data:any){
    return data.map((item:any)=>{
      return{
        id:item.detailedProductID,
        quantity:item.quantity===0?item.quantityImport:item.quantity,
        priceSell:item.priceSell,
        available:true,
        isDeleted:false,
        dateRelease:item.dateRelease,
        dateEnd:item.dateEnd,
        product:[{id:item.productID}],
        importInfo:{id:null}
      }
    })
  }

  getImportInfo(data:any){
    return data.map((item:any)=>{
      return{
        id:null,
        priceImport:+item.priceImport,
        quantityImport:+item.quantityImport,
        Import:{id:this.id?.value},
        product:{id:item.productID},
        detailedProduct:this.getDetailedProduct(data),
        status:item.quantity===0||item.status===3?1:2,
      }
    })
  }

  submit(){
    console.log(this.formImport.value);
    if(this.formImport.valid){
      // console.log("valid");
      // console.log(this.createProductByIdForm.value);
      of(this.formImport.value).pipe(
        map((data:any) => {
          return{
            id:data.id.toUpperCase(),
            address:data.address,
            date:data.date,
            shipperName:data.shipperName,
            staffName:data.staffName,
            picture:"",
            importInfo:this.getImportInfo(data.productByIdArray),
            isDeleted:false,
          }
        }),
        tap((e)=>{
          console.log(e);
          this.obs$ = this.rest.post(GlobalUrl.post_AddImport_Admin,e).pipe(
            map((data:any)=>{
              if(data.message==='ok'){
                this.message.successMessage("Thêm đơn hàng thành công!");
                this.sharedData._sharedMessage("refresh");
                this.resetForm();
              }else{
                this.message.errorMessage("Thêm đơn hàng thất bại!");
              }
            })
          ).subscribe();
          
        })
      ).subscribe();
    }else{
      console.log("invalid");
      validateAllFormFields(this.formImport);
      validateAllFormFields(this.createProductByIdForm);
      
      console.log( findInvalidControlsRecursive(this.createProductByIdForm));
      findInvalidControlsRecursive(this.createProductByIdForm)
    }
    
  }
  resetForm(){
    this.formArrayProduct.reset();
    this.formImport.reset();
    this.productChooseStacking = [];
    this.productIDArray = [];
    this.tabs = ['No Product'];
  }
  ngOnDestroy(){
    if(this.obs$){
      this.obs$.unsubscribe();
    }
  }
  get id(){return this.formImport.get('id')};
  get address(){return this.formImport.get('address')};
  get date(){return this.formImport.get('date')};
  get shipperName(){return this.formImport.get('shipperName')};
  get staffName(){return this.formImport.get('staffName')};

  get formArray(){return this.formImport.get('productByIdArray')}
  // get staffName(){return this.formImport.get('staffName')};

  get nameGroup(){return this.nameSearchGroup.get('nameGroup')};

  //formArray
  get formArrayProduct(){return this.formImport.get('productByIdArray') as FormArray}

  get id_array(){return this.formArrayProduct.get('id')}
  get name_array(){return this.formArrayProduct.get('name')}
  get quantity(){return this.formArrayProduct.get('quantity')}
}
