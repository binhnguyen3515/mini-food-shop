import { Routes } from '@angular/router';
import { HomeGuard } from 'src/app/guards/home.guard';
import { CategorySubComponent } from '../categorySub/categorySub.component';
import { DetailComponent } from '../detail/detail.component';
import { Edit_profileComponent } from '../edit_profile/edit_profile.component';
import { ForgotPassComponent } from '../forgotPass/forgotPass.component';
import { Payment_logComponent } from '../payment_log/payment_log.component';
import { ProductComponent } from '../product/product.component';
import { RegisterComponent } from '../register/register.component';
import { SearchByNameComponent } from '../searchByName/searchByName.component';
import { SecondLoginComponent } from '../secondLogin/secondLogin.component';
import { Shoping_cartComponent as Shopping_cartComponent } from '../shoping_cart/shoping_cart.component';
import { HomeComponent } from './home.component';

export const homeRoutes: Routes = [
  { path: '', component: HomeComponent, children: [
    { path: 'product', component: ProductComponent},
    { path: 'detail/:id', component: DetailComponent},
    { path: 'log', component: Payment_logComponent},
    { path: 'cart', component: Shopping_cartComponent},
    { path: 'profile', component: Edit_profileComponent,canActivate:[HomeGuard]},
    { path: 'register', component: RegisterComponent},
    { path: 'forgotPass', component: ForgotPassComponent},
    { path: 'login', component: SecondLoginComponent},
    { path: 'paymentLog', component: Payment_logComponent,canActivate:[HomeGuard]},
    { path: ':cateSubID', component: CategorySubComponent},
    { path: 'search/:searchName', component: SearchByNameComponent},
  ] },
];
