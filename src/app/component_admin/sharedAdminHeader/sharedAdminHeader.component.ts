import { Component, Input, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/guards/tokenStorage.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-sharedAdminHeader',
  templateUrl: './sharedAdminHeader.component.html',
  styleUrls: ['./sharedAdminHeader.component.css']
})
export class SharedAdminHeaderComponent implements OnInit {
  @Input()entity!: string;
  currentDate = new Date();
  constructor(public tokenStorage:TokenStorageService,public utilityService:UtilityService) {
    setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
   }

  ngOnInit() {
    console.log(this.entity);
  }

}
