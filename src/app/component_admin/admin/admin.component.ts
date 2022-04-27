import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, shareReplay, tap } from 'rxjs';
import { GlobalUrl } from 'src/app/common/url';
import { AuthService } from 'src/app/guards/auth.service';
import { TokenStorageService } from 'src/app/guards/tokenStorage.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(public tokenStorage: TokenStorageService,private auth:AuthService,private route:Router,private rest:RestApiService) { }

  ngOnInit() {
  }
  onClickToggleSideBar(){
    const btn = document.querySelector(".sidebar");
    btn?.classList.toggle("active")
    
  }
  logout(){
    this.auth.logout();
    this.route.navigate(['home/login']);
    // this.sharedData.changeData("Bạn");
  }
} 
