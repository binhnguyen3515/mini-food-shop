import { RecoverConfirmComponent } from './../dialogs/recoverConfirm/recoverConfirm.component';
import { AdminInvoiceInnerTableComponent } from './../adminInvoiceInnerTable/adminInvoiceInnerTable.component';
import { AdminImportComponent } from './../adminImport/adminImport.component';
import { ProductAddAndEditComponent } from './../dialogs/productAddAndEdit/productAddAndEdit.component';
import { enableProdMode, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedTableComponent } from '../sharedTable/sharedTable.component';
import { MaterialModule } from 'src/app/material/material.module';
import { AdminProductComponent } from '../adminProduct/adminProduct.component';
import { PipeFilterImage } from 'src/app/common/pipeFilterImage';
import { PipeConvertToString } from 'src/app/common/pipeConvertToString';
import { SharedAdminHeaderComponent } from '../sharedAdminHeader/sharedAdminHeader.component';
import { SharedModalCenterComponent } from '../sharedModal/sharedModalCenter/sharedModalCenter.component';
import { SharedModalDirective } from '../sharedModal/sharedModal.directive';
import { FileUploadComponent } from '../fileUpload/fileUpload.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadDirective } from '../fileUpload/fileUpload.directive';
import { StatisticsComponent } from '../statistics/statistics.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DeleteComfirmComponent } from '../dialogs/deleteComfirm/deleteComfirm.component';
import { AdminImportInnerTableComponent } from '../adminImportInnerTable/adminImportInnerTable.component';
import { ImportEditDialogComponent } from '../dialogs/importEditDialog/importEditDialog.component';
import { ImportAddDialogComponent } from '../dialogs/importAddDialog/importAddDialog.component';
import { AdminInvoiceComponent } from '../adminInvoice/adminInvoice.component';
import { AdminAccountComponent } from '../adminAccount/adminAccount.component';
import { InvoiceEditDialogComponent } from '../dialogs/invoiceEditDialog/invoiceEditDialog.component';
import { AccountAddAndEditComponent } from '../dialogs/accountAddAndEdit/accountAddAndEdit.component';

import { DxChartModule } from "devextreme-angular";
import { DxSelectBoxModule } from "devextreme-angular";
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxResponsiveBoxModule } from 'devextreme-angular';
import { DxPieChartModule } from 'devextreme-angular';
import { DxFunnelModule } from 'devextreme-angular';
import { AdminLogComponent } from '../adminLog/adminLog.component';
import { AdminRecoverProductComponent } from '../adminRecoverProduct/adminRecoverProduct.component';
import { AdminRecoverAccountComponent } from '../adminRecoverAccount/adminRecoverAccount.component';
import { AdminWorkingLogComponent } from '../adminWorkingLog/adminWorkingLog.component';
import { InvoicePrintDialogComponent } from '../dialogs/invoicePrintDialog/invoicePrintDialog.component';
import { AdminTopCustomerComponent } from '../adminTopCustomer/adminTopCustomer.component';
@NgModule({
  declarations: [
    AdminComponent,
    AdminProductComponent,
    AdminImportComponent,
    AdminImportInnerTableComponent,
    AdminInvoiceComponent,
    AdminInvoiceInnerTableComponent,
    AdminAccountComponent,
    AdminLogComponent,
    AdminWorkingLogComponent,
    AdminRecoverAccountComponent,
    AdminRecoverProductComponent,
    AdminTopCustomerComponent,
    
    StatisticsComponent,
    //Shared Table
    SharedTableComponent,
    //Shared Admin Header
    SharedAdminHeaderComponent,
    //IsImage Pipe
    PipeFilterImage,
    //Convert To String Pipe
    PipeConvertToString,
    //Shared MOdal center
    SharedModalCenterComponent,
    SharedModalDirective,

    //Dialogs
    ProductAddAndEditComponent,
    ImportEditDialogComponent,
    DeleteComfirmComponent,
    RecoverConfirmComponent,
    ImportAddDialogComponent,
    InvoiceEditDialogComponent,
    InvoicePrintDialogComponent,
    AccountAddAndEditComponent,
    
    //Files component
    FileUploadComponent,
    FileUploadDirective,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    //Angular material
    MaterialModule,

    //File input
    NgbModule,
    MaterialFileInputModule,

    //Chart DevExtreme
    DxChartModule,
    DxSelectBoxModule,
    DxButtonModule,
    DxResponsiveBoxModule,
    DxPieChartModule,
    DxFunnelModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class AdminModule { }
