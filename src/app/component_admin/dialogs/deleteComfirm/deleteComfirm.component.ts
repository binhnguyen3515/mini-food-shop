import { GlobalUrl } from 'src/app/common/url';
import { Component, Input, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SharedDataService } from 'src/app/services/sharedData.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-deleteComfirm',
  templateUrl: './deleteComfirm.component.html',
  styleUrls: ['./deleteComfirm.component.css']
})
export class DeleteComfirmComponent implements OnInit {
  @Input()data:any;
  constructor(private rest:RestApiService,private sharedData:SharedDataService) { }

  ngOnInit() {
    this.remove();
    
    
  }

  remove() {
    
    const id = this.data.id;
    const entity = this.data.entity;
    console.log("remove id: "+id+" - entity: "+entity);

    let message = "";
    let title = "";
    let api = "";
    if(entity ==='Product'){
      message = "Bạn có muốn xoá sản phẩm này?";
      title = "sản phẩm";
      api =GlobalUrl.delete_DeleteProduct;
    }
    if(entity ==='Import'){
      message = "Bạn có muốn xoá đơn nhập này?";
      title = "đơn nhập hàng";
      api ="";
    }
    if(entity ==='Invoice'){
      message = "Bạn có muốn xoá hoá đơn này?";
      title = "hoá đơn";
      api =GlobalUrl.delete_DeleteInvoice;
    }
    if(entity ==='Account'){
      message = "Bạn có muốn xoá tài khoản này?";
      title = "Tài khoản";
      api =GlobalUrl.delete_DeleteAccount;
    }
    Swal.fire({
      title: `Xoá ${title}`,
      text: `${message}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        /**api link here */
        this.rest.delete(api,id).subscribe(result => {
          Swal.fire(
            `Đã xoá ${title} thành công!`,
            '',
            'success'
          )
          this.sharedData._sharedMessage("refresh");
        })
      }
    })
  }
}
