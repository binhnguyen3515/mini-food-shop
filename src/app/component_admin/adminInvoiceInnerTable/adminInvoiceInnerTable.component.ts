import { productDetailsDTO } from './../../models-dto/productDetailsDTO';
import { validateAllFormFields } from 'src/app/common/validators';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { filter, map, mergeMap, Observable, shareReplay, startWith, Subject, Subscription, tap, toArray } from 'rxjs';
import { GlobalUrl } from 'src/app/common/url';
import { RestApiService } from 'src/app/services/rest-api.service';
import Swal from 'sweetalert2';
import { SharedDataService } from 'src/app/services/sharedData.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/guards/auth.service';

@Component({
  selector: 'app-adminInvoiceInnerTable',
  templateUrl: './adminInvoiceInnerTable.component.html',
  styleUrls: ['./adminInvoiceInnerTable.component.css']
})
export class AdminInvoiceInnerTableComponent implements OnInit {
  baseHostImageUrl = GlobalUrl.baseHostImageUrl;
  @Input() data: any;
  @Input()userId!:number;
  @Input()invoiceID!:number;
  @Input()refresh:Subject<any> = new Subject();
  @Output() rowData = new EventEmitter<any>();
  @Output() memberShipType = new EventEmitter<any>();
  selectedRow:any;
  innerDisplayedColumns: string[] = ["id","name", "quantity","price","discount","total","action"];
  iconAddToggle="add";
  memberShipType_For_Delete_Add_Action="";
  dataSource!: MatTableDataSource<any>
  statusList:any[] = [
    {id:1,status:"Pending"},
    {id:2,status:"Paid"},
    {id:3,status:"Cancel"},
    {id:4,status:"Refund"},
    {id:5,status:"Shipping"},
  ]
  hideContent=true;
  nameGroupOptions$!:Observable<any>;
  listNameProduct:any[] = [{id:'',name:'',picture:''}];
  getProductID!:number;
  nameSearchGroup = this.fb.group({
    nameGroup:['',[Validators.required]]
  })

  formStatus = this.fb.group({
    status:['',[Validators.required]]
  })

  formEditInvoiceItem = this.fb.group({
    id:[''],
    name:[''],
    price:['',[Validators.required,Validators.min(0),Validators.max(1000000000)]],
    quantity:['',[Validators.required,Validators.pattern("^[0-9]*$"),Validators.min(1),Validators.max(10)]],
    discount:['',[Validators.required,Validators.min(0),Validators.max(1000000000)]],
    invoiceID:[''],
    productID:[''],
  })
  @ViewChild(MatPaginator,{ static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort ,{ static: true}) sort!: MatSort;

  obs$!: Subscription;
  userInfo:any;
  constructor(private rest:RestApiService,private fb:FormBuilder,
    private sharedData:SharedDataService,private message:AlertService,
    public auth:AuthService) { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ngOnInit() {
    // console.log(this.data);
    // console.log(this.userId);
    if(!this.auth.isAdminOrManager()){
      this.statusList= [
        {id:2,status:"Paid"},
        {id:3,status:"Cancel"},
      ]
    }
    this.obs$ = this.rest.get(GlobalUrl.get_AllAccount_Admin).pipe(
      mergeMap((data:any) =>data),
      filter((data:any)=>data.id === this.userId),
      tap((e)=>console.log(e)),
      tap((e)=>this.memberShipType.emit(e.memberShip.type)),
      tap((e)=>this.memberShipType_For_Delete_Add_Action=e.memberShip.type),
      tap((e)=>this.userInfo = e),
    ).subscribe()

    //reset table when submit update from parent InvoiceEditDialogComponent
    this.obs$ = this.refresh.subscribe(v=>{
      this.dataSource = new MatTableDataSource<any[]>(v);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

    this.dataSource = new MatTableDataSource<any[]>(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    //search product name
    this.obs$ = this.rest.get(GlobalUrl.get_AllProduct_Admin).pipe(
      mergeMap((data:any)=>data),
      filter((e:any)=>e.importInfo!==null),
      map((data:any)=>{
        return {
          id:data.id,
          name:data.name,
          picture:data.picture,
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
  private _filterStates(value: string): any[] {
    const filterValue = value.toLowerCase();
    //get productID by name;
    try {
      let productID:any = this.listNameProduct.filter(e=>e.name.toLowerCase()===filterValue)[0];
      if(productID !== undefined) {
        this.obs$ = this.rest.getOne(GlobalUrl.get_DetailedProduct_Admin,productID.id).pipe(
          map((data:any)=>{
            return{
              productID:data.id,
              price:data.productDetailsDTO.priceSell,
              discount:data.discountDTO?data.discountDTO.percentage*100:0,
              invoiceID:this.invoiceID,
            }
          }),
          tap((e)=>console.log(e))
        ).subscribe((result)=>{
          this.formEditInvoiceItem.patchValue(result);
        });
      }else{
        console.log("undefined");
      }
    } catch (error) {
      
    }

    return this.listNameProduct.filter(e => e.name.toLowerCase().includes(filterValue));
  }
  saveStatus(){
    console.log(this.formStatus.value);
    console.log("invoiceID:"+this.invoiceID);
    console.log("run");
    if(this.formStatus.valid){
      Swal.fire({
        title: `Cập nhật hoá đơn`,
        text: `Bạn có muốn cập nhật trạng thái [${this.status?.value}] cho hoá đơn này`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Update'
      }).then((result) => {
        if (result.isConfirmed) {
          this.rest.put(GlobalUrl.put_UpdateInvoiceStatus,this.formStatus.value,this.invoiceID)
          .subscribe((result:any) =>{
            if(result?.message =='Bạn đã cập nhật sang trạng thái Paid trước đó'){
              Swal.fire(
                'Lỗi cập nhật!',
                `${result.message}`,
                'warning'
              );
            }else{
              Swal.fire(
                'Đã cập nhật!',
                'Cập nhật thành công.',
                'success'
              );
              this.sharedData._sharedMessage("refresh");
              this.formStatus.reset();
            }
          })
        }
      })
    }else{
      validateAllFormFields(this.formStatus);
    }

  }
  addAndGetId(id:any,action:string){
    console.log("id: "+id+" -- action:"+action);
    if(action ==='edit'){
      let a = this.dataSource.data.filter(data => data.id===id)
      .map(data=>{
        return {
          id:data.id,
          name:data.name,
          quantity:data.quantity,
          price:data.price,
          discount:data.discount,
        }
      })[0];
      this.rowData.emit(a);
    }
    if(action === 'delete'){
      Swal.fire({
        title: `Cập nhật hoá đơn`,
        text: `Bạn có muốn xoá sản phẩm trong hoá đơn này`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
      }).then((result) => {
        if (result.isConfirmed) {
         //use put instead delete because we want to update totalPayment after deleting item
          this.rest.put(GlobalUrl.put_DeleteInvoiceItem,{memberShip:this.memberShipType_For_Delete_Add_Action},id)
          .subscribe((result) =>{
            Swal.fire(
              'Đã xoá!',
              'Xoá thành công.',
              'success'
            );
            this.sharedData._sharedMessage("refresh");
            this.rowData.emit("delete");
          })
        }
      })
    }
  }
  toggleAdd(){
    if(this.hideContent){
      this.iconAddToggle = 'clear';
      this.hideContent = false;
    }else{
      this.iconAddToggle = 'add';
      this.formEditInvoiceItem.reset();
      this.nameSearchGroup.reset();
      this.hideContent = true;
    }
  }
  addItemToInvoice(){
    console.log(this.formEditInvoiceItem.value);
    if(this.formEditInvoiceItem.valid && this.nameSearchGroup.valid){
      console.log("valid");
      console.log(this.dataSource.data);
      //check if this product is existed inside table
      let productItem = this.dataSource.data.filter(item=>item.id===this.productID?.value)[0];
      if(productItem!==undefined){
        this.message.warningMessage("Sản phẩm này đã có trong hoá đơn, vui lòng chọn sản phẩm khác!");
      }else{
        console.log(this.formEditInvoiceItem.value);
        let converter = {
          id:null,
          quantity:this.quantity?.value,
          price:this.price?.value,
          discount:this.discount?.value/100,
          invoice:{id:this.invoiceID},
          detailedProduct:{id:this.productID?.value}
        }
        Swal.fire({
          title: `Cập nhật hoá đơn`,
          text: `Bạn có muốn thêm sản phẩm vào hoá đơn này`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Add'
        }).then((result) => {
          if (result.isConfirmed) {
  
           this.rest.put(GlobalUrl.put_AddItemToInvoice,converter,this.memberShipType_For_Delete_Add_Action)
            .subscribe((result) =>{
              Swal.fire(
                'Đã thêm sản phẩm!',
                'Thêm sản phẩm vào hoá đơn thành công.',
                'success'
              );
              this.sharedData._sharedMessage("refresh");
              this.rowData.emit("add");
              this.iconAddToggle = 'add';
              this.formEditInvoiceItem.reset();
              this.nameSearchGroup.reset();
              this.hideContent = true;
            })
          }
        })
      }
      

    }else{
      validateAllFormFields(this.formEditInvoiceItem);
      validateAllFormFields(this.nameSearchGroup);
    }
  }
  ngOnDestroy() {
    if(this.obs$){
      this.obs$.unsubscribe();
    }
  }

  get status() {return this.formStatus.get('status')};

  get nameGroup(){return this.nameSearchGroup.get('nameGroup')};

  get productID(){return this.formEditInvoiceItem.get('productID')};
  get name(){return this.formEditInvoiceItem.get('name')};
  get price(){return this.formEditInvoiceItem.get('price')};
  get quantity(){return this.formEditInvoiceItem.get('quantity')};
  get discount(){return this.formEditInvoiceItem.get('discount')};
}
