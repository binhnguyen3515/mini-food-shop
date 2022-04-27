import { InvoicePrintDialogComponent } from './../../dialogs/invoicePrintDialog/invoicePrintDialog.component';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/services/alert.service';
import { AccountAddAndEditComponent } from '../../dialogs/accountAddAndEdit/accountAddAndEdit.component';
import { ImportAddDialogComponent } from '../../dialogs/importAddDialog/importAddDialog.component';
import { ImportEditDialogComponent } from '../../dialogs/importEditDialog/importEditDialog.component';
import { InvoiceEditDialogComponent } from '../../dialogs/invoiceEditDialog/invoiceEditDialog.component';
import { ProductAddAndEditComponent } from '../../dialogs/productAddAndEdit/productAddAndEdit.component';

@Component({
  selector: 'app-sharedModalCenter',
  templateUrl: './sharedModalCenter.component.html',
  styleUrls: ['./sharedModalCenter.component.css']
})
export class SharedModalCenterComponent implements OnInit {
  @ViewChild('deleteDialog',{static:true})deleteData!:any;
  @ViewChild('recoverDialog',{static:true})recoverData!:any;
  isDeleted = false;
  isRecovered = false;
  @Input()data!:any;
  constructor(public dialog:MatDialog) { }

  ngOnInit() {
    const id = this.data.id;
    const action = this.data.action;
    const entity = this.data.entity;
    //Product Management
    console.log(entity);
    if((action === 'add'|| action === 'edit') && entity.toLowerCase() ==='product'){
      this.openProductDialog(id);
    }
    //Product Management Edge

    //Import Management
    if((action === 'edit') && entity.toLowerCase() ==='import'){
      this.openEditImportDialog(id);
    }
    
    if((action === 'add') && entity.toLowerCase() ==='import'){
      this.openAddImportDialog();
    }
    //Import Management Edge


    //Account Management
    console.log(entity);
    if((action === 'add'|| action === 'edit') && entity.toLowerCase() ==='account'){
      this.openAccountDialog(id);
    }
    //Account Management Edge

    if((action=== 'delete')){
      this.isDeleted=true;
      this.deleteData = {id:id,entity:entity};
      
    }

    if((action=== 'recover')){
      this.isRecovered=true;
      this.recoverData = {id:id,entity:entity};
      
    }

    //Invoice Management
    if((action==='edit' && entity ==='Invoice')){
      this.openEditInvoiceDialog(id);
    }
    if(action==='print' && entity ==='Invoice'){
      this.openPrintInvoiceDialog(id);
    }
    //Invoice Management Edge
  }

  openProductDialog(id:any) {
    const dialogRef = this.dialog.open(ProductAddAndEditComponent,{ disableClose: true ,data:{id:id}});

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
  }

  openEditImportDialog(id:any){
    const dialogRef = this.dialog.open(ImportEditDialogComponent,{ disableClose: true ,data:{id:id}});

    dialogRef.afterClosed().subscribe(result => {});
  }

  openAddImportDialog(){
    const dialogRef = this.dialog.open(ImportAddDialogComponent,{ disableClose: true});

    dialogRef.afterClosed().subscribe(result => {});
  }

  openEditInvoiceDialog(id:any){
    const dialogRef = this.dialog.open(InvoiceEditDialogComponent,{ disableClose: true , data:{id:id}});

    dialogRef.afterClosed().subscribe(result => {});
  }

  openPrintInvoiceDialog(id:any){
    const dialogRef = this.dialog.open(InvoicePrintDialogComponent,{ disableClose: false , data:{id:id}});

    dialogRef.afterClosed().subscribe(result => {});
  }

  openAccountDialog(id:any){
    const dialogRef = this.dialog.open(AccountAddAndEditComponent,{ disableClose: true ,data:{id:id}});

    dialogRef.afterClosed().subscribe(result => {});
  }
}
