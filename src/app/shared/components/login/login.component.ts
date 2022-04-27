import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  @Input()toggleModal!:string;
  @Output() closeAction = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
    console.log("run");
    
  }

  closeModal(){
    this.toggleModal = "";
    this.closeAction.emit();
  }
}
