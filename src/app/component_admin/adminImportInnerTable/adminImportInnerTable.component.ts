import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, Subscription } from 'rxjs';
import { GlobalUrl } from 'src/app/common/url';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SharedDataService } from 'src/app/services/sharedData.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-adminImportInnerTable',
  templateUrl: './adminImportInnerTable.component.html',
  styleUrls: ['./adminImportInnerTable.component.css']
})
export class AdminImportInnerTableComponent implements OnInit ,OnDestroy {
  baseHostImageUrl = GlobalUrl.baseHostImageUrl;
  @Input() data: any;
  @Output() rowData = new EventEmitter<any>();
  @Output() refreshRequest = new EventEmitter<any>();
  selectedRow:any;
  innerDisplayedColumns: string[] = ["id", "picture","name","priceImport","quantityImport","status","action"];
  dataSource!: MatTableDataSource<any>
  obs$!:Subscription;
  constructor(private sharedData:SharedDataService,private rest:RestApiService){}

  @ViewChild(MatPaginator,{ static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort ,{ static: true}) sort!: MatSort;

  addAndGetId(id:any,action:string){
    console.log("id: "+id+" -- action:"+action);
    if(action ==='edit'){
      let a = this.dataSource.data.filter(data => data.id===id)
      .map(data=>{
        return {
          importInfoId:data.id,
          name:data.product.name,
          priceImport:data.priceImport,
          quantityImport:data.quantityImport,
          status:data.status,
        }
      })[0];
      this.rowData.emit(a);
    }
    if(action ==='delete'){
      Swal.fire({
        title: `Cập nhật thông tin nhập hàng`,
        text: `Bạn có muốn thu hồi sản phẩm trong đơn nhập hàng này, sản phẩm bị thu hồi sẽ được gỡ khỏi kệ hàng`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete'
      }).then((result) => {
        if (result.isConfirmed) {
          this.rest.delete(GlobalUrl.delete_DeleteImportInfoByItem_Admin,id).pipe(
            map((data:any) => {
              if(data.message==='OK'){
                Swal.fire(
                  'Đã thu hồi sản phẩm!',
                  'Thu hồi thành công.',
                  'success'
                );
                this.rowData.emit("delete");
                this.refreshRequest.emit("requestNewData");
              }else{
                Swal.fire(
                  'Thu hồi!',
                  'Thu hồi thất bại.',
                  'error'
                );
              }
            })
          ).subscribe()
        }
      })
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ngOnInit() {
    this.getData(this.data);
    this.obs$ = this.sharedData.currentMessage.subscribe((r:any) => {
      if(r.msg==="refresh"){
        this.getData(r.data);
      }
    })

    this.obs$ = this.sharedData.currentMessage.subscribe((r:any) => {
      if(r.msg==="requestRefresh"){
        this.getData(r.data);
      }
    })
  }

  getData(item:any){
    this.dataSource = new MatTableDataSource<any[]>(item);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(){
    if(this.obs$){
      this.obs$.unsubscribe();
    }
  }
}

