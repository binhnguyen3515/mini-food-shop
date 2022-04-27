import { SecondLoginComponent } from './../secondLogin/secondLogin.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/shared/components/login/login.component';
import { CategoryComponent } from '../category/category.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { homeRoutes } from './home-routing.module';
import { HomeComponent } from './home.component';

import { ProductComponent } from '../product/product.component';

import {NgxPaginationModule} from 'ngx-pagination'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DetailComponent } from '../detail/detail.component';
import { Edit_profileComponent } from '../edit_profile/edit_profile.component';
import { RegisterComponent } from '../register/register.component';
import { ForgotPassComponent } from '../forgotPass/forgotPass.component';
import { Payment_logComponent } from '../payment_log/payment_log.component';
import { Shoping_cartComponent } from '../shoping_cart/shoping_cart.component';
import { PipeRemoveUniCode } from 'src/app/common/pipeRemoveUnicode';
import { SearchByNameComponent } from '../searchByName/searchByName.component';
import { CustomPipe } from 'src/app/common/pipeSort';
import { CategorySubComponent } from '../categorySub/categorySub.component';
import { TypeofPipe } from 'src/app/common/pipeTypeOf';
import { PipeInvoiceStatus } from 'src/app/common/pipeInvoiceStatus';
import { SharedProductDisplayComponent } from '../sharedProductDisplay/sharedProductDisplay.component';
import { SharedProductDisplay_2Component } from '../sharedProductDisplay_2/sharedProductDisplay_2.component';
import { SharedProductDisplay_3Component } from '../sharedProductDisplay_3/sharedProductDisplay_3.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(homeRoutes),
    //TranslateModule,
    ReactiveFormsModule,
    //pagination
    NgxPaginationModule,

    //ng-bootstrap
    NgbModule,
  ],
  declarations: [
    HomeComponent,
    HeaderComponent,
    CategoryComponent,
    CategorySubComponent,
    FooterComponent,
    ProductComponent,
    DetailComponent,
    Shoping_cartComponent,
    SearchByNameComponent,
    //Account
    Edit_profileComponent,
    RegisterComponent,
    ForgotPassComponent,
    Payment_logComponent,

    SecondLoginComponent,
    //reuse component
    LoginComponent,
    //removeUnicode Pipe
    PipeRemoveUniCode,
    //Sort Pipe
    CustomPipe,
    //Type of Pipe
    TypeofPipe,
    //Pipe invoice status
    PipeInvoiceStatus,

    //Shared Product Content
    SharedProductDisplayComponent,
    SharedProductDisplay_2Component,
    SharedProductDisplay_3Component,
  ],
  exports: [
    LoginComponent
  ]
  
})
export class HomeModule {}
