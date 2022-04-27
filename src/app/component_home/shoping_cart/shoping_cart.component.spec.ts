/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Shoping_cartComponent } from './shoping_cart.component';

describe('Shoping_cartComponent', () => {
  let component: Shoping_cartComponent;
  let fixture: ComponentFixture<Shoping_cartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Shoping_cartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Shoping_cartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
