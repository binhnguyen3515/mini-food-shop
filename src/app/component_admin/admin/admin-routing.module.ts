import { AdminTopCustomerComponent } from './../adminTopCustomer/adminTopCustomer.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminAndManagerGuard } from "src/app/guards/admin-and-manager.guard";
import { AdminAccountComponent } from "../adminAccount/adminAccount.component";
import { AdminImportComponent } from "../adminImport/adminImport.component";
import { AdminInvoiceComponent } from "../adminInvoice/adminInvoice.component";
import { AdminLogComponent } from "../adminLog/adminLog.component";
import { AdminProductComponent } from "../adminProduct/adminProduct.component";
import { AdminRecoverAccountComponent } from "../adminRecoverAccount/adminRecoverAccount.component";
import { AdminRecoverProductComponent } from "../adminRecoverProduct/adminRecoverProduct.component";
import { AdminWorkingLogComponent } from "../adminWorkingLog/adminWorkingLog.component";
import { StatisticsComponent } from "../statistics/statistics.component";
import { AdminComponent } from "./admin.component";

const routes: Routes = [
    {path:'',component:AdminComponent,children:[
      { path: 'import', component: AdminImportComponent,canActivate:[AdminAndManagerGuard]},
      { path: 'product', component: AdminProductComponent,canActivate:[AdminAndManagerGuard] },
      { path: 'statistics', component: StatisticsComponent,canActivate:[AdminAndManagerGuard]},
      { path: 'topCustomer', component: AdminTopCustomerComponent,canActivate:[AdminAndManagerGuard]},
      { path: 'invoice', component: AdminInvoiceComponent},
      { path: 'account', component: AdminAccountComponent,canActivate:[AdminAndManagerGuard]},
      { path: 'accountLog', component: AdminLogComponent,canActivate:[AdminAndManagerGuard]},
      { path: 'workingLog', component: AdminWorkingLogComponent,canActivate:[AdminAndManagerGuard]},
      { path: 'recoverAccount', component: AdminRecoverAccountComponent,canActivate:[AdminAndManagerGuard]},
      { path: 'recoverProduct', component: AdminRecoverProductComponent,canActivate:[AdminAndManagerGuard]},
    ]}
  ];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class AdminRoutingModule { }