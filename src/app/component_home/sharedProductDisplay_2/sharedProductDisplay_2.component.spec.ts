/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SharedProductDisplay_2Component } from './sharedProductDisplay_2.component';

describe('SharedProductDisplay_2Component', () => {
  let component: SharedProductDisplay_2Component;
  let fixture: ComponentFixture<SharedProductDisplay_2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedProductDisplay_2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedProductDisplay_2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
