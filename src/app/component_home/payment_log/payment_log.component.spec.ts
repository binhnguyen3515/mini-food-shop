/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Payment_logComponent } from './payment_log.component';

describe('Payment_logComponent', () => {
  let component: Payment_logComponent;
  let fixture: ComponentFixture<Payment_logComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Payment_logComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Payment_logComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
