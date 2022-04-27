import { HttpClientModule } from '@angular/common/http';
import { enableProdMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { authInterceptorProviders } from './guards/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

@NgModule({
  declarations: [	
    AppComponent,
      NotFoundComponent,
      // LoginComponent
      
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent],
  exports: [
    // LoginComponent
  ]
})
export class AppModule { }
platformBrowserDynamic().bootstrapModule(AppModule);