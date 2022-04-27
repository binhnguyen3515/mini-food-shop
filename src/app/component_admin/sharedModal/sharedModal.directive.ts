import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appSharedModal]'
})
export class SharedModalDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
