import { Component, Input, OnInit } from '@angular/core';
import { GlobalUrl } from 'src/app/common/url';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SharedDataService } from 'src/app/services/sharedData.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recoverConfirm',
  templateUrl: './recoverConfirm.component.html',
  styleUrls: ['./recoverConfirm.component.scss']
})
export class RecoverConfirmComponent implements OnInit {

  @Input()data:any;
  constructor(private rest:RestApiService,private sharedData:SharedDataService) { }

  ngOnInit() {
    this.recover();
  }

  recover(){
    const id = this.data.id;
    const entity = this.data.entity;
    console.log("recover id: "+id+" - entity: "+entity);

    let message = "";
    let title = "";
    let api = "";
    if(entity ==='Recover Account'){
      message = "Bạn có muốn khôi phục tài khoản này?";
      title = "tài khoản";
      api =GlobalUrl.put_recover_Account;
    }
    if(entity ==='Recover Product'){
      message = "Bạn có khôi phục sản phẩm này?";
      title = "sản phẩm";
      api =GlobalUrl.put_recover_Product;
    }

    Swal.fire({
      title: `Khôi phục ${title}`,
      text: `${message}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Recover'
    }).then((result) => {
      if (result.isConfirmed) {
        /**api link here */
        this.rest.put(api,{},id).subscribe(result => {
          Swal.fire(
            `Đã khôi phục ${title} thành công!`,
            '',
            'success'
          )
          this.sharedData._sharedMessage("refresh");
        })
      }
    })
  }
}
