/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SharedProductDisplay_3Component } from './sharedProductDisplay_3.component';

describe('SharedProductDisplay_3Component', () => {
  let component: SharedProductDisplay_3Component;
  let fixture: ComponentFixture<SharedProductDisplay_3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedProductDisplay_3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedProductDisplay_3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
